import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { InteligentAction } from "$lib/types";

// In a server-side file
import { env } from "$env/dynamic/private";
import { VIEWPORT_SIZE } from "./puppeteer";

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

export async function generateAction(systemPrompt: string, imgUrl: string) {
	const response = await openai.chat.completions.create({
		model: "gpt-4o-2024-08-06",
		response_format: zodResponseFormat(InteligentAction, "click_coordinates"),
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
}
