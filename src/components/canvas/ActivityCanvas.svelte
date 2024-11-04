<script lang="ts">
  import { actions } from '$lib/stores/actionStore';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // Add any canvas-specific logic here
  let canvas: HTMLCanvasElement;
  
  $: activeActions = $actions;
</script>

<div class="relative w-full h-full">
  <canvas bind:this={canvas} class="absolute inset-0" />
  
  <div class="absolute inset-0 p-4">
    {#each activeActions as action (action.id)}
      <div
        class="bg-card rounded-lg p-4 mb-4 shadow-lg"
        in:fly={{ y: 20, duration: 300 }}
        out:fade
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold capitalize">{action.type}</span>
            <span class="text-sm text-muted-foreground">{action.description}</span>
          </div>
          <span class="text-sm capitalize {action.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}">
            {action.status}
          </span>
        </div>
        
        {#if action.result}
          <div class="mt-2 text-sm text-muted-foreground">
            {action.result}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div> 