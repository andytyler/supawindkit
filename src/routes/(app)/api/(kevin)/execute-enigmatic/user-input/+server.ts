import { json } from "@sveltejs/kit";
import { pendingUserInputs } from "../../../../../../lib/server/kevin/action";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	const { run_id, input } = await request.json();

	const resolve = pendingUserInputs.get(run_id);
	if (resolve) {
		resolve(input);
		pendingUserInputs.delete(run_id);
		return json({ success: true, message: "Input received" });
	} else {
		return json({ success: false, message: "No pending input request found" }, { status: 400 });
	}
};
