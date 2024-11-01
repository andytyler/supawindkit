<script lang="ts">
  import type { Activity } from "$lib/types"
  import ActivityCard from "./ActivityCard.svelte"

  export let activities: Activity[] = [
    {
      id: "1",
      title: "Project Overview",
      type: "document",
      group: "Documentation",
      content:
        "This document outlines the key objectives and milestones for our Q4 project initiatives.",
      position: { x: 100, y: 100 },
      zIndex: 1,
      config: {
        minWidth: "300px",
        gridSize: [24, 24],
      },
    },
    {
      id: "2",
      title: "Architecture Diagram",
      type: "image",
      group: "Technical",
      content: "https://picsum.photos/800/600",
      position: { x: 200, y: 200 },
      zIndex: 2,
      config: {
        minWidth: "200px",
        gridSize: [24, 24],
      },
    },
    {
      id: "3",
      title: "Meeting Notes",
      type: "note",
      group: "Planning",
      content:
        "Key decisions from today's planning meeting:\n- Finalized tech stack\n- Agreed on MVP scope\n- Set milestone dates\n- Assigned core responsibilities",
      position: { x: 300, y: 100 },
      zIndex: 3,
      config: {
        minWidth: "250px",
        gridSize: [24, 24],
        favicon: "https://mail.google.com/mail/u/0/#inbox",
      },
    },
    {
      id: "4",
      title: "Gmail",
      type: "email",
      group: "Communications",
      content: {
        to: "team@company.com",
        subject: "Weekly Progress Update",
        body: "Hi everyone,\n\nHere's a summary of what we accomplished this week:\n\n- Completed initial architecture design\n- Set up development environment\n- Started on core features\n\nLet me know if you have any questions!\n\nBest regards",
      },
      position: { x: 400, y: 300 },
      zIndex: 4,
      config: {
        minWidth: "350px",
        favicon: "https://mail.google.com/mail/u/0/#inbox",
        gridSize: [24, 24],
      },
    },
  ]

  function handleDragEnd(activity: Activity, e: CustomEvent) {
    const { offsetX, offsetY } = e.detail
    activity.position = { x: offsetX, y: offsetY }
    activities = activities
  }

  function handleCardClick(activity: Activity) {
    const maxZ = Math.max(...activities.map((a) => a.zIndex))
    if (activity.zIndex < maxZ) {
      activity.zIndex = maxZ + 1
      activities = activities
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
    {#each activities as activity (activity.id)}
      <ActivityCard
        {activity}
        on:neodrag:end={(e) => handleDragEnd(activity, e)}
        on:click={() => handleCardClick(activity)}
      />
    {/each}
  </div>
</div>
