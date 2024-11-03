import { writable } from "svelte/store";

export const userInputStore = writable<{
	[run_id: string]: { isWaiting: boolean; prompt: string };
}>({});

export function displayUserInputPrompt(run_id: string, prompt: string) {
	userInputStore.update((store) => ({
		...store,
		[run_id]: { isWaiting: true, prompt },
	}));
}

export function hideUserInputPrompt(run_id: string) {
	userInputStore.update((store) => ({
		...store,
		[run_id]: { isWaiting: false, prompt: "" },
	}));
}
