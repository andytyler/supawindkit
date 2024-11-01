import { logEvent } from "$lib/stores/chatStore";
import { json } from "@sveltejs/kit";
import { single_shot } from "./action.js";

export async function POST({ request }) {
	const { site, goal } = await request.json();

	// Start the process in the background
	process(site, goal);

	return json({ success: true, message: "Execution started" });
}

async function process(site: string, goal: string) {
	try {
		// Simulate the process with some example events
		logEvent({ role: "STARTED", content: "Starting process..." });

		await single_shot([], null, goal, site, [], undefined);

		logEvent({ role: "response", content: "Process completed." });
	} catch (error) {
		console.error("Error in process:", error);
		logEvent({ role: "error", content: "An error occurred during execution." });
	}
}
