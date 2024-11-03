import { json } from "@sveltejs/kit";
import { activateStopFlag } from "../action";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ fetch }) => {
	try {
		activateStopFlag();
		return json({ success: true, message: "Process stopped successfully" });
	} catch (error) {
		console.error("Error stopping process:", error);
		return json({ success: false, message: "Failed to stop process" }, { status: 500 });
	}
};
