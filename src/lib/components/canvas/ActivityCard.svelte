<script lang="ts">
  import { draggable } from "@neodrag/svelte"
  import { fade } from "svelte/transition"

  type Activity = {
    id: string
    title: string
    type: "document" | "image" | "video" | "note"
    group: string
    content: string
    position: { x: number; y: number }
    zIndex: number
  }

  export let activity: Activity
</script>

<div
  use:draggable={{
    bounds: "parent",
    handle: ".handle",
    grid: [24, 24],
    position: activity.position,
  }}
  class="absolute bg-card rounded-lg shadow-lg border border-border min-w-[200px]"
  style="z-index: {activity.zIndex};"
  transition:fade
>
  <div
    class="handle bg-muted p-2 rounded-t-lg cursor-move flex items-center justify-between"
  >
    <span class="font-medium">{activity.title}</span>
    <span class="text-xs text-muted-foreground">{activity.group}</span>
  </div>
  <div class="p-4 bg-card rounded-b-lg">
    {activity.content}
  </div>
</div>
