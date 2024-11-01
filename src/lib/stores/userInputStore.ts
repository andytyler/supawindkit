import { writable } from "svelte/store";

type UserInputRequest = {
	isWaiting: boolean;
	prompt: string;
	run_id: string | null;
};

export const userInputStore = writable<UserInputRequest>({
	isWaiting: false,
	prompt: "",
	run_id: null,
});

export function displayUserInputPrompt(prompt: string, run_id: string) {
	userInputStore.set({
		isWaiting: true,
		prompt,
		run_id,
	});
}

export function hideUserInputPrompt() {
	userInputStore.set({
		isWaiting: false,
		prompt: "",
		run_id: null,
	});
}
