import type { Actions } from "./$types";

export const actions: Actions = {
	execute: async ({ fetch, request }) => {
		const data = await request.formData();
		const site = data.get("site") as string;
		const goal = data.get("goal") as string;

		// Call the API endpoint to start the process
		const response = await fetch("/api/execute-enigmatic", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ site, goal }),
		});

		if (response.ok) {
			return {
				success: true,
				message: "Execution started",
			};
		} else {
			return {
				success: false,
				message: "Failed to start execution",
			};
		}
	},
};
