<script lang="ts">
  import {
    activityStore,
    updateActivityPosition,
    updateActivityZIndex,
  } from "$lib/stores/activityStore"
  import type { Activity } from "$lib/types"
  import ActivityCard from "./ActivityCard.svelte"

  // Subscribe to the store
  $: activities = $activityStore

  function handleDragEnd(activity: Activity, e: CustomEvent) {
    const { offsetX, offsetY } = e.detail
    updateActivityPosition(activity.id, { x: offsetX, y: offsetY })
  }

  function handleCardClick(activity: Activity) {
    const maxZ = Math.max(...activities.map((a) => a.zIndex))
    if (activity.zIndex < maxZ) {
      updateActivityZIndex(activity.id, maxZ + 1)
    }
  }
</script>

<div class="h-full w-full bg-background relative">
  <!-- Canvas background with dots -->
  <div
    class="absolute inset-0"
    style="background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 2px, transparent 0); background-size: 24px 24px;"
  />

  <!-- Activities container -->
  <div class="relative h-full w-full">
    {#each $activityStore as activity (activity.id)}
      <ActivityCard
        {activity}
        on:neodrag:end={(e) => handleDragEnd(activity, e)}
        on:click={() => handleCardClick(activity)}
      />
    {/each}
  </div>
</div>
