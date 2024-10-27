import { OpenAI } from "openai";

// In a server-side file
import { env } from "$env/dynamic/private";

const openai = new OpenAI({
	apiKey: env.OPENAI_API_KEY,
});

export const SystemPromptDescribeClickableItems = `
<context>
You are a web navigation expert.
You are given a screenshot of the website page you are curently on.
Additional JS has been loaded to outline every clickable item in a red box.
</context>


<TASK> 
You MUST describe ALL the elements that might be clickable OR are outlined red 
and describe what you would expect to happen if you clicked on it. 
</TASK>`;

export async function AskChatGPTWithSystemPromptAndImage(systemPrompt: string, imgUrl: string) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: [
						{
							type: "image_url",
							image_url: {
								url: imgUrl,
							},
						},
					],
				},
			],
			max_tokens: 4096,
		});
		return response;
	} catch (error) {
		console.error("Error AskChatGPTWithSystemPromptAndImage:", error);
		return null;
	}
}

export async function askChatGPT(systemPrompt: string, userInput: string) {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: userInput,
			},
		],
		max_tokens: 4096,
		stream: true,
	});
	return response;
}

export async function askChatGPTNoStream(systemPrompt: string, userInput: string) {
	console.log('🤖  askChatGPTNoStream: ', systemPrompt.slice(0, 50) + '...');
	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: userInput,
			},
		],
		max_tokens: 4096,
	});

	if (response.choices[0].message?.content) {
		return {
			data: response.choices[0].message?.content?.trim(),
			error: null,
		};
	} else {
		return {
			data: null,
			error: 'No response from ChatGPT',
		};
	}
}
