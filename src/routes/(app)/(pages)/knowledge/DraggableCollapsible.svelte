<script lang="ts">
  import type { Execution } from "$lib/stores/executionStore"
  import { deleteExecution } from "$lib/stores/executionStore"
  import { draggable } from "@neodrag/svelte"
  import { ChevronDown, ChevronUp, GripVertical, Trash2, StopCircle } from "lucide-svelte"

  export let execution: Execution
  $: collapsed = false

  function toggleCollapse() {
    collapsed = !collapsed
  }

  async function handleStop() {
    try {
      const response = await fetch("/api/execute-enigmatic/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ run_id: execution.run_id }),
      });
      if (!response.ok) {
        throw new Error("Failed to stop execution");
      }
    } catch (error) {
      console.error("Error stopping execution:", error);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this execution?")) {
      return;
    }

    try {
      const response = await fetch("/api/conductor/executions/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ run_id: execution.run_id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete execution");
      }
    } catch (error) {
      console.error("Error deleting execution:", error);
    }
  }
</script>

<div use:draggable class="absolute top-4 left-4 bg-card border border-border rounded-lg shadow-lg max-w-min hover:shadow-xl">
  <div class="flex items-center justify-between bg-muted rounded-t-lg">
    <div class="flex items-center gap-2 p-1">
      <GripVertical class="cursor-grab h-5 w-5 text-muted-foreground" />
      {#if execution.status === "running"}
        <span class="h-2 w-2 rounded-full bg-primary/80 animate-pulse" />
      {:else if execution.status === "completed"}
        <span class="h-2 w-2 rounded-full bg-green-500/80" />
      {:else if execution.status === "stopped"}
        <span class="h-2 w-2 rounded-full bg-red-500/80" />
      {/if}
      <h2 class="text-lg font-medium text-foreground/80">
        {execution.run_id}
      </h2>
    </div>
    <div class="flex items-center gap-2 pr-2">
      {#if execution.status === "running"}
        <button 
          on:click={handleStop}
          class="p-1 hover:bg-background/80 rounded-full"
          title="Stop Execution"
        >
          <StopCircle class="h-5 w-5 text-red-500" />
        </button>
      {/if}
      <button 
        on:click={handleDelete}
        class="p-1 hover:bg-background/80 rounded-full"
        title="Delete Execution"
      >
        <Trash2 class="h-5 w-5 text-muted-foreground hover:text-red-500" />
      </button>
      <button 
        on:click={toggleCollapse}
        class="p-1 hover:bg-background/80 rounded-full"
      >
        {#if collapsed}
          <ChevronDown class="h-5 w-5 text-muted-foreground" />
        {:else}
          <ChevronUp class="h-5 w-5 text-muted-foreground" />
        {/if}
      </button>
    </div>
  </div>

  {#if !collapsed}
    <slot />
  {/if}
</div>

<style>
  /* Add any additional styles here */
</style>
