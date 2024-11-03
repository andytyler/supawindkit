import { logEvent } from "$lib/stores/chatStore";
import type { EventType, InteligentAction } from "$lib/types";
import type { Page } from "puppeteer";
import getHtml from "waterfall-fetch";
import { generateAction } from "./llm";
import { getScreenshot, VIEWPORT_SIZE } from "./puppeteer";

let shouldStop = false;

// Export the pendingUserInputs Map
export const pendingUserInputs = new Map<string, (input: string) => void>();

export function activateStopFlag() {
	shouldStop = true;
}

export function resetStopFlag() {
	shouldStop = false;
}

// might want to make puppeteer not close the browser and if i pass in an option then it will not close the browser and return the page.
export async function single_shot(
	previousActions: InteligentAction[],
	previousScreenshot: string | null,
	goal: string,
	site: string,
	inputPageActionableElements: any,
	page: Page,
	run_id: string
) {
	let chats: EventType[] = [];
	// need to add a get page part to getHtml, where it will be able to give you the active page
	// to pass into the next function instead of creating a new page each time.
	// ALSO need to return the end url so we can use it in the next function
	// FOR NOW we can return it as part of the response object

	let actionableElements = inputPageActionableElements;
	let start_screenshot = previousScreenshot;

	if (shouldStop) {
		logEvent({ run_id, type: "stop", action: null, message: "Process stopped by user" }, run_id);
		return { success: false, message: "Process stopped by user" };
	}

	if (!start_screenshot || !page) {
		const { evaluation_result, page: newPage } = await getHtml(site, { set: "js", evalFunction: getScreenshot, keepBrowserOpen: true });

		logEvent({ run_id, type: "start", action: null, message: site }, run_id);
		logEvent({ run_id, type: "url", action: null, message: site }, run_id);
		logEvent({ run_id, type: "goal", action: null, message: goal }, run_id);
		logEvent({ run_id, type: "screenshot", action: null, message: evaluation_result.screenshot_url }, run_id);
		// addChat({ run_id, type: "other", content: JSON.stringify(evaluation_result.clickableElements) });

		start_screenshot = evaluation_result.screenshot_url;
		page = newPage;
		actionableElements = evaluation_result.clickableElements;
	}

	if (!start_screenshot || !page) {
		logEvent({ run_id, type: "error", action: null, message: "No start_screenshot found" }, run_id);
		return {
			success: false,
			chats_out: chats,
		};
	}
	// Get the clickable items
	// logEvent({ run_id, type: "prompt", action: null, message: SystemPromptDescribeClickableItems });

	// const clickableItems = await AskChatGPTWithSystemPromptAndImage(SystemPromptDescribeClickableItems, start_screenshot);
	// const clickableItemsResponse = clickableItems?.choices[0]?.message?.content || "";

	// logEvent({ run_id, type: "screenshot", action: null, message: start_screenshot });
	// logEvent({ run_id, type: "user", action: null, message: clickableItemsResponse });

	// let previousActionsList = "";
	// if (previousActions && previousActions.length > 0) {
	// 	previousActionsList = previousActions
	// 		.map((inteligentAction, index) => {
	// 			return `${index + 1}. Action: ${inteligentAction.action.type}
	//  URL: ${site}
	//  Produced Expected Output: ${inteligentAction.outcome}`;
	// 		})
	// 		.join("\n");
	// }

	const decideOnAction = `
You will be given a screenshot of the web page you are on.
The screenshot will be 512px by 512px.

You must navigate the website until you reach your goal.
Goal: "${goal}"

You can CLICK, SCROLL, TYPE, or REQUEST_USER_INPUT.
You can only give instructions to do one thing at a time.
Think about what might need to be done before you take an action. for example if you are logging in you should type the username before you click continue.
Always ask the user for login information if you need it, or you dont know exactly the exact details of what to type.

What is the next action you must do?
- CLICK: If you need to click, give me the coordinates where you would like me to click, the origin i.e. 0,0 starts at the top left of the image. Always click in the center of the element.
- SCROLL: If you need to scroll, specify the direction ('up' or 'down') and the distance in pixels.
- TYPE: If you need to type, specify the text you want to enter.
- REQUEST_USER_INPUT: If you need input from the user, specify the prompt you want to display.

I will do the action and then I will show you the result of the action.
Return your decision as a JSON object with 'action' and necessary details. 
For example:
{"action": "click", "x": 512, "y": 512}
or
{"action": "scroll", "direction": "down", "distance": 300}
or
{"action": "type", "text": "Hello World"}
or
{"action": "request_user_input", "prompt": "Please enter your name"}

${
	previousActions && previousActions.length > 0
		? `Your previous action is below, you should take note and learn from it. Don't repeat the same action multiple times, try to do something different.
PreviousActions:
${JSON.stringify(previousActions)}
`
		: "- This is the first action."
}

Javascript has been run on the page to identify every actionable or clickable item on the page. 
This might include more items than you have identified from the screenshot, as the 
screenshot might only show part of the page, whereas the JS has been run on the entire loaded page.

ClickableItems from javascript:
${JSON.stringify(actionableElements)}
`;
	// Consider that you can only see a square of the page at a time so you might need to scroll to see other items on the page.

	// What have you learnt from this action that you should pass on to all the next agents?
	// for example if you learn that a button does something you should tell the next agent
	// what the button does and where the button is, including the page its on.
	// this is to build up an understanding of website and prevent wasted repetition.

	logEvent({ run_id, type: "prompt", action: null, message: decideOnAction }, run_id);

	const chatCompletion = await generateAction(decideOnAction, start_screenshot);
	const actionResponse = chatCompletion.choices[0]?.message?.content || "";

	logEvent({ run_id, type: "response", action: null, message: actionResponse }, run_id);

	const llmActionResponse: InteligentAction = JSON.parse(actionResponse);

	if (!llmActionResponse.GOAL_ACHIEVED) {
		const performAction = async (page: Page) => {
			console.log("🎭  Performing action.");
			await page.setViewport({ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE, deviceScaleFactor: 0 });
			try {
				if (llmActionResponse.action.type === "click" && llmActionResponse.action.click) {
					const viewport = await page.viewport();
					const pageWidth = viewport?.width || 0;
					const pageHeight = viewport?.height || 0;
					const clickX = llmActionResponse.action.click.x;
					const clickY = llmActionResponse.action.click.y;

					// Check if coordinates are within the viewport
					if (clickX < 0 || clickX > pageWidth || clickY < 0 || clickY > pageHeight) {
						console.log("Coordinates out of viewport. Attempting to scroll to the element.");

						// Attempt to find the nearest clickable element based on coordinates
						const element = await page.evaluateHandle(
							(x, y) => {
								const elements = Array.from(document.querySelectorAll("*"));
								// Find the topmost element that contains the coordinates
								return (
									elements.find((el) => {
										const rect = el.getBoundingClientRect();
										return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
									}) || null
								);
							},
							clickX,
							clickY
						);

						const elementBox = await element.asElement()?.boundingBox();

						if (elementBox) {
							// Scroll to the element
							await page.evaluate((el) => {
								if (el) {
									el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
								}
							}, element);

							// Update the viewport origin if necessary
							// (Puppeteer does not provide a direct method to get the scroll position,
							// so we retrieve it using page.evaluate)
							const newOrigin = await page.evaluate(() => {
								return { x: window.scrollX, y: window.scrollY };
							});

							console.log(`New viewport origin: (${newOrigin.x}, ${newOrigin.y})`);

							// Calculate the new click coordinates relative to the updated viewport
							const newClickX = elementBox.x + elementBox.width / 2 - newOrigin.x;
							const newClickY = elementBox.y + elementBox.height / 2 - newOrigin.y;

							// Perform the click at the new coordinates
							await page.mouse.click(newClickX, newClickY);
							logEvent({
								run_id,
								type: "click",
								action: llmActionResponse,
								message: JSON.stringify({ ...llmActionResponse, screenshot: start_screenshot }),
							}, run_id);
						} else {
							console.log("Element not found at the specified coordinates.");
						}
					} else {
						// Coordinates are within the viewport; perform the click directly
						await page.mouse.click(clickX, clickY);
						logEvent({
							run_id,
							type: "click",
							action: llmActionResponse,
							message: JSON.stringify({ ...llmActionResponse, screenshot: start_screenshot }),
						}, run_id);
					}
				} else if (llmActionResponse.action.type === "scroll" && llmActionResponse.action.scroll) {
					logEvent({
						run_id,
						type: "scroll",
						action: llmActionResponse,
						message: JSON.stringify({ ...llmActionResponse, screenshot: start_screenshot }),
					}, run_id);
					const scrollDistance =
						llmActionResponse.action.scroll.direction === "up"
							? -llmActionResponse.action.scroll.distance
							: llmActionResponse.action.scroll.distance;
					await page.evaluate((y) => {
						window.scrollBy(0, y);
					}, scrollDistance);
				} else if (llmActionResponse.action.type === "type" && llmActionResponse.action.text) {
					logEvent({
						run_id,
						type: "type",
						action: llmActionResponse,
						message: JSON.stringify({ ...llmActionResponse, screenshot: start_screenshot }),
					}, run_id);
					await page.keyboard.type(llmActionResponse.action.text);
				} else if (llmActionResponse.action.type === "request_user_input" && llmActionResponse.action.prompt) {
					logEvent({
						run_id,
						type: "request_user_input",
						action: llmActionResponse,
						message: llmActionResponse.action.prompt,
					}, run_id);

					// Create a promise that will be resolved when user input is received
					const userInput = await new Promise<string>((resolve) => {
						pendingUserInputs.set(run_id, resolve);
					});

					// Log the user's response
					logEvent({
						run_id,
						type: "user_input",
						action: null,
						message: userInput,
					}, run_id);

					// Type the user's input into the focused element
					if (userInput) {
						await page.keyboard.type(userInput);
					}

					await new Promise((resolve) => setTimeout(resolve, 2000));
					return getScreenshot(page);
				} else {
					console.log("Invalid action or missing parameters");
				}
			} catch (error) {
				console.error("Error performing action:", error);
				throw error; // Re-throw to handle in getHtml
			}

			await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
			return getScreenshot(page);
		};

		let evaluation_result_2;
		if (page) {
			// Use the existing page if it's passed in
			console.log("🔵  Using existing page.");
			evaluation_result_2 = await performAction(page);
		} else {
			// If no page is passed, use getHtml to create a new page
			// THIS MUST NEVER HAPPEN
			throw new Error("No page passed to performAction");
			// const { evaluation_result } = await getHtml(site, { set: "js", evalFunction: performAction });
			// evaluation_result_2 = evaluation_result;
		}

		if (!evaluation_result_2) {
			logEvent({ run_id, type: "error", action: null, message: "Failed to get evaluation result after action" }, run_id);
			return {
				success: false,
				chats_out: chats,
			};
		}

		const end_url = evaluation_result_2.end_url || site;
		const screenshot_url = evaluation_result_2.screenshot_url || start_screenshot;
		const clickableElements = evaluation_result_2.clickableElements || actionableElements;

		logEvent({ run_id, type: "screenshot", action: null, message: screenshot_url }, run_id);
		logEvent({ run_id, type: "url", action: null, message: end_url }, run_id);
		logEvent({ run_id, type: "loop_end", action: null, message: "LOOP END" }, run_id);

		// continue the loop
		await single_shot([...previousActions, llmActionResponse], screenshot_url, goal, end_url, clickableElements, page, run_id);
	}
	return {
		success: true,
	};
}
