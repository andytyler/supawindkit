import supabase from "$lib/supabase";
import { writable } from "svelte/store";

export type Execution = {
  run_id: string;
  goal: string;
  site: string;
  payload: any;
  status: "running" | "completed" | "stopped";
};

// Initialize the executions store
export const executions = writable<Execution[]>([]);

// Function to fetch executions from the database
export async function fetchExecutions() {
  const { data, error } = await supabase
    .from("executions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching executions:", error);
  } else {
    executions.set(data || []);
  }
}

// Function to add a new execution to the database
export async function addExecution(execution: Execution) {
  const { data, error } = await supabase
    .from("executions")
    .insert([execution]);

  if (error) {
    console.error("Error adding execution:", error);
  } else {
    executions.update((current) => [execution, ...current]);
  }
}

// Function to delete an execution from the database
export async function deleteExecution(run_id: string) {
  const { error } = await supabase
    .from("executions")
    .delete()
    .eq("run_id", run_id);

  if (error) {
    console.error("Error deleting execution:", error);
  } else {
    executions.update((current) =>
      current.filter((exec) => exec.run_id !== run_id)
    );
  }
}

// Fetch executions on store initialization
fetchExecutions();
