<script lang="ts">
  import type { Execution } from "$lib/stores/executionStore"
  import { draggable } from "@neodrag/svelte"
  import { ChevronDown, ChevronUp, GripVertical } from "lucide-svelte"

  // Reactive state for collapsed/expanded
  $: collapsed = false

  // Toggle collapse state
  function toggleCollapse() {
    collapsed = !collapsed
  }

  export let execution: Execution
</script>

<div
  use:draggable
  class="absolute top-4 left-4 bg-card border border-border rounded-lg shadow-lg max-w-min hover:shadow-xl"
>
  <!-- Header with handle and collapse button -->
  <div class="flex items-center justify-between bg-muted rounded-t-lg">
    <!-- Drag Handle -->
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

    <!-- Collapse Button -->
    <button on:click={toggleCollapse} class="focus:outline-none px-2">
      {#if collapsed}
        <ChevronDown class="h-5 w-5 text-muted-foreground" />
      {:else}
        <ChevronUp class="h-5 w-5 text-muted-foreground" />
      {/if}
    </button>
  </div>

  <!-- Content Slot -->
  {#if !collapsed}
    <div class="">
      <slot />
    </div>
  {/if}
</div>
