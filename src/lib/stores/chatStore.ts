import type { EventType } from "$lib/types";
import { writable } from "svelte/store";

export const chatStore = writable<{ [run_id: string]: EventType[] }>({});

export function logEvent(newEvent: EventType, run_id: string) {
	chatStore.update((events) => ({
		...events,
		[run_id]: [...(events[run_id] || []), newEvent],
	}));
}
