import serviceRoleClient from "$lib/server/supabase";
import type { Page } from "puppeteer";

export const VIEWPORT_SIZE = 512; // also edit in Console.svelte
// SCREENSHOT

interface ElementCoordinate {
	x: number;
	y: number;
	width: number;
	height: number;
	text: string;
	tagName: string;
	type: "clickable" | "input" | "hover";
}

export async function getScreenshot(page: Page) {
	await page.setViewport({ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE });

	// Inject and execute JavaScript to add red outlines for clickable elements,
	// blue outlines for input elements, and green outlines for elements with hover events.
	const enhancedElements = await page.evaluate(() => {
		const clickableSelectors = 'a, button, input[type="submit"], [onclick], [role="button"]';
		const inputSelectors = "input, textarea, select";
		const hoverSelectors = "[onmouseover], [onmouseenter]";

		function isElementVisible(el: Element): boolean {
			const style = window.getComputedStyle(el);
			const rect = el.getBoundingClientRect();

			return !(style.display === "none" || style.visibility === "hidden" || style.opacity === "0" || rect.width === 0 || rect.height === 0);
		}

		// Cleanup existing outlines
		document.querySelectorAll(".element-outline").forEach((el) => el.remove());

		const elements = document.querySelectorAll<HTMLElement>(`${clickableSelectors}, ${inputSelectors}, ${hoverSelectors}`);
		const coordinates: ElementCoordinate[] = [];

		elements.forEach((el) => {
			if (!isElementVisible(el)) return;

			const rect = el.getBoundingClientRect();
			const computedStyle = window.getComputedStyle(el);

			// Determine element type
			let elementType: ElementCoordinate["type"] = "clickable";
			if (el.matches(inputSelectors)) {
				elementType = "input";
			} else if (el.matches(hoverSelectors)) {
				elementType = "hover";
			}

			coordinates.push({
				x: rect.left,
				y: rect.top,
				width: rect.width,
				height: rect.height,
				text: el.textContent?.trim() || "",
				tagName: el.tagName.toLowerCase(),
				type: elementType,
			});

			// Create outline element
			const wrapper = document.createElement("div");
			wrapper.className = "element-outline";
			Object.assign(wrapper.style, {
				position: "absolute",
				outline: `2px solid ${elementType === "input" ? "blue" : elementType === "hover" ? "green" : "red"}`,
				pointerEvents: "none",
				zIndex: computedStyle.zIndex,
				left: `${rect.left}px`,
				top: `${rect.top}px`,
				width: `${rect.width}px`,
				height: `${rect.height}px`,
			});

			document.body.appendChild(wrapper);
		});

		return coordinates;
	});

	const screenshot = await page.screenshot();
	const fileName = `screenshot_${Date.now()}.png`;
	console.log("📸  SCREENSHOT TAKEN", fileName);

	// Use the service role key for server-side operations
	const { data, error } = await serviceRoleClient.storage.from("kevin_screenshots").upload(fileName, screenshot, {
		contentType: "image/png",
	});

	if (error) {
		console.error("Error uploading screenshot:", error);
		return null;
	}

	const { data: publicUrlData } = await serviceRoleClient.storage.from("kevin_screenshots").createSignedUrl(fileName, 60 * 60); // URL valid for 1 hour

	return {
		screenshot_url: publicUrlData?.signedUrl || null,
		page: page,
		end_url: page.url(),
		clickableElements: enhancedElements,
	};
}
