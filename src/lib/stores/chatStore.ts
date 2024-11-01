import type { EventType } from "$lib/types";
import { writable } from "svelte/store";

export const chatStore = writable<EventType[]>([]);

export function logEvent(newEvent: EventType) {
	chatStore.update((events) => [...events, newEvent]);
}
