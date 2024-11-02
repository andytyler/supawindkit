<script lang="ts">
  import {
    updateActivityPosition,
    updateActivityZIndex,
  } from "$lib/stores/activityStore"
  import type { Activity } from "$lib/types"
  import { draggable } from "@neodrag/svelte"
  import { fade } from "svelte/transition"
  import GmailComposerCard from "./GmailComposerCard.svelte"

  export let activity: Activity

  function handleDragEnd(e: CustomEvent) {
    const { offsetX, offsetY } = e.detail
    updateActivityPosition(activity.id, { x: offsetX, y: offsetY })
  }

  function handleClick() {
    updateActivityZIndex(activity.id, activity.zIndex + 1)
  }
</script>

<div
  use:draggable={{
    bounds: "parent",
    handle: ".handle",
    grid: activity.config?.gridSize ?? [24, 24],
    position: activity.position,
  }}
  class="absolute bg-card rounded-lg shadow-lg border border-border hover:border-border-hover transition-colors"
  style="
    z-index: {activity.zIndex};
    min-width: {activity.config?.minWidth ?? '200px'};
  "
  transition:fade
  role="button"
  tabindex="0"
  on:neodrag:end={handleDragEnd}
  on:click={handleClick}
  on:keydown={(e) => e.key === "Enter" && handleClick()}
>
  <div
    class="handle bg-muted p-2 rounded-t-lg cursor-move flex items-center justify-between"
  >
    <div class="flex items-center gap-2">
      {#if activity.config?.favicon}
        <img
          src={`https://www.google.com/s2/favicons?domain=${activity.config?.favicon}&size=256`}
          alt="Favicon"
          class="w-6 h-6"
        />
      {/if}
      <span class="font-medium">{activity.title}</span>
    </div>
    <span class="text-xs text-muted-foreground">{activity.group}</span>
  </div>
  <div class="bg-card rounded-b-lg">
    {#if activity.type === "email" && typeof activity.content === "object"}
      <GmailComposerCard
        subject={activity.content.subject}
        to={activity.content.to}
        content={activity.content.body}
      />
    {:else if activity.type === "image"}
      <img
        src={activity.content}
        alt={activity.title}
        class="w-full h-auto rounded-b-lg"
      />
    {:else}
      <p class="p-4">{activity.content}</p>
    {/if}
  </div>
</div>
