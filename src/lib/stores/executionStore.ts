import { writable } from "svelte/store";

export type Execution = {
  run_id: string;
  goal: string;
  site: string;
  status: "running" | "completed" | "stopped";
};

// Load initial state from localStorage if available
const storedExecutions = typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('executions') || '[]') 
  : [];

export const executions = writable<Execution[]>(storedExecutions);

// Subscribe to changes and save to localStorage
if (typeof window !== 'undefined') {
  executions.subscribe(value => {
    localStorage.setItem('executions', JSON.stringify(value));
  });
}
