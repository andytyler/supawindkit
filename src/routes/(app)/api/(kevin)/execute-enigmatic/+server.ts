import { json } from "@sveltejs/kit";
import { single_shot } from "../../../../../lib/server/kevin/action.js";

export async function POST({ request }) {
	const { site, goal, run_id } = await request.json();

	// Start the process in the background
	process(site, goal, run_id);

	// Return success response
	return json({ success: true, message: "Execution started", run_id });
}

async function process(site: string, goal: string, run_id: string) {
	try {
		await single_shot([], null, goal, site, [], null, run_id);
		// Optionally, handle completion
	} catch (error) {
		console.error("Error in process:", error);
		// Optionally, handle errors and update execution status
	}
}
