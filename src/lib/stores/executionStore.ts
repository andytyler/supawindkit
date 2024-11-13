import supabase from "$lib/supabase";
import type { ExecutionPayload } from "$lib/types/llm-schemas";
import { writable } from "svelte/store";

export type Execution = {
  run_id: string;
  payload: {activity?: ExecutionPayload, success?: boolean, output?: any, error?: string | null};
  status: "running" | "completed" | "stopped";
};

// Initialize the executions store
export const executions = writable<Execution[]>([]);

// Function to fetch executions from the database
export async function fetchExecutions() {
  try {
    const { data, error } = await supabase
      .from("executions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching executions: ${error.message}`);
    }

    executions.set(data || []);
  } catch (error) {
    console.error("Error fetching executions:", error);
    throw error;
  }
}

// Function to add a new execution to the database
export async function addExecution(execution: Execution) {
  try {
    const { data, error } = await supabase
      .from("executions")
      .insert([{...execution, workbench_id:1}])
      .select('run_id')
      .single();

    if (error) {
      throw new Error(`Error adding execution: ${error.message}`);
    }

    const executionWithId = { ...execution, run_id: data.run_id };

    // Only update the store if the database insertion was successful
    executions.update((current) => [executionWithId, ...current]);

    return executionWithId;
  } catch (error) {
    console.error("Error adding execution:", error);
    throw error;
  }
}

// Function to delete an execution from the database
export async function deleteExecution(run_id: string) {
  try {
    const { error } = await supabase
      .from("executions")
      .delete()
      .eq("run_id", run_id);

    if (error) {
      throw new Error(`Error deleting execution: ${error.message}`);
    }

    // Only update the store if the database deletion was successful
    executions.update((current) =>
      current.filter((exec) => exec.run_id !== run_id)
    );
  } catch (error) {
    console.error("Error deleting execution:", error);
    throw error; // Re-throw the error to handle it in the UI
  }

}

// Add the stopExecution function
export async function stopExecution(run_id: string) {
  try {
    // const response = await fetch("/api/execute-enigmatic/stop", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ run_id }),
    // });
    
    // if (!response.ok) {
    //   throw new Error("Failed to stop execution");
    // }

    // Update the store to reflect the stopped status
    executions.update((current) =>
      current.map((exec) =>
        exec.run_id === run_id
          ? { ...exec, status: "stopped" }
          : exec
      )
    );
  } catch (error) {
    console.error("Error stopping execution:", error);
    throw error;
  }
}

// Function to update an execution in the database and store
export async function updateExecution(run_id: string, updates: Partial<Execution>) {
  try {
    const { error } = await supabase
      .from("executions")
      .update(updates)
      .eq("run_id", run_id);

    if (error) {
      throw new Error(`Error updating execution: ${error.message}`);
    }

    // Only update the store if the database update was successful
    executions.update((current) =>
      current.map((exec) =>
        exec.run_id === run_id
          ? { ...exec, ...updates }
          : exec
      )
    );

    return true;
  } catch (error) {
    console.error("Error updating execution:", error);
    throw error;
  }
}

// Fetch executions on store initialization
fetchExecutions();
