<script lang="ts">
  import {
    PaneGroup,
    ResizableHandle,
    ResizablePane,
  } from "$lib/components/ui/resizable"
  import { Separator } from "$lib/components/ui/separator"
  import type { PageData } from "../chat/$types"
  import ActivityCanvas from "./ActivityCanvas.svelte"

  export let data: PageData

  import { chatStore } from "$lib/stores/chatStore"
  import { executions } from "$lib/stores/executionStore"
  import { displayUserInputPrompt } from "$lib/stores/userInputStore"
  import { onDestroy, onMount } from "svelte"
  import ConductorInput from "./ConductorInput.svelte"

  let loading = false
  let eventSource: EventSource | null = null

  function connectEventSource() {
    if (eventSource) {
      eventSource.close()
    }
    eventSource = new EventSource("/api/chat-stream")
    eventSource.onmessage = (event) => {
      const newChat = JSON.parse(event.data)
      chatStore.update((chats) => {
        const existingChats = chats[newChat.run_id] || []
        return {
          ...chats,
          [newChat.run_id]: [...existingChats, newChat],
        }
      })

      executions.update((currentExecutions) => {
        const executionExists = currentExecutions.some(
          (e) => e.run_id === newChat.run_id,
        )
        if (!executionExists) {
          return [
            ...currentExecutions,
            {
              run_id: newChat.run_id,
              goal: newChat.goal || "",
              site: newChat.site || "",
              status: "running",
            },
          ]
        }
        return currentExecutions
      })

      // Check for user input requests
      if (newChat.type === "request_user_input") {
        displayUserInputPrompt(newChat.run_id, newChat.message);
      }
    }
    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
      if (eventSource) {
        eventSource.close()
        eventSource = null
      }
      // Attempt to reconnect after a delay
      setTimeout(connectEventSource, 2000)
    }
  }

  onMount(() => {
    connectEventSource()
  })

  onDestroy(() => {
    if (eventSource) {
      eventSource.close()
    }
  })
</script>

<div class="flex flex-col md:flex-row gap-4 h-full">
  <PaneGroup direction="horizontal">
    <ResizablePane defaultSize={2 / 3} minSize={30}>
      <div class="h-full w-full bg-background relative">
        <!-- Canvas background with dots -->
        <div
          class="absolute inset-0"
          style="background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 2px, transparent 0); background-size: 24px 24px;"
        />

        <!-- Your canvas content goes here -->
        <div class="h-[calc(100vh-4rem)]">
          <ActivityCanvas />
        </div>
      </div>
    </ResizablePane>
    <ResizableHandle withHandle />
    <ResizablePane defaultSize={1 / 3} minSize={30}>
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold">Execute</h1>
        </div>
      </div>
      <Separator />

      <div class="">
        <!-- <MessagesContainer {messages} />
        <TipTapInput /> -->
        <!-- <ParentChat /> -->
        <ConductorInput />
      </div>
    </ResizablePane>
  </PaneGroup>
</div>
