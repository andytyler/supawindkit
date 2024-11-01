import { writable } from 'svelte/store';

/**
 * Stores the IDs of selected tags.
 * This store ensures that both Chat and Tags components stay in sync.
 */
export const selectedTagIds = writable<number[]>([]); 