<script lang="ts">
  import ActivityCard from "./ActivityCard.svelte"

  type Activity = {
    id: string
    title: string
    type: "document" | "image" | "video" | "note"
    group: string
    content: string
    position: { x: number; y: number }
    zIndex: number
  }

  export let activities: Activity[] = [
    {
      id: "1",
      title: "Activity 1",
      type: "document",
      group: "Group 1",
      content: "Content 1",
      position: { x: 100, y: 100 },
      zIndex: 1,
    },
    {
      id: "2",
      title: "Activity 2",
      type: "document",
      group: "Group 2",
      content: "Content 2",
      position: { x: 200, y: 200 },
      zIndex: 2,
    },
  ]

  function handleDragEnd(activity: Activity, e: CustomEvent) {
    const { offsetX, offsetY } = e.detail
    activity.position = { x: offsetX, y: offsetY }
    activities = activities
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
    {#each activities as activity (activity.id)}
      <ActivityCard
        {activity}
        on:neodrag:end={(e) => handleDragEnd(activity, e)}
      />
    {/each}
  </div>
</div>
