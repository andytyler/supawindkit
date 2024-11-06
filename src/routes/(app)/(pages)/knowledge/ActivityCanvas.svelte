<script lang="ts">
  import type { Execution } from "$lib/stores/executionStore"
  import { executions } from "$lib/stores/executionStore"
  import { onMount } from "svelte"
  import ChatsStream from "./ChatsStream.svelte"
  import DraggableCollapsible from "./DraggableCollapsible.svelte"
  import PreviewPane from "./PreviewPane.svelte"
  import UserInputModal from "./UserInputModal.svelte"

  let executionList: Execution[] = []

  // Use reactive statement instead of direct subscription
  $: executionList = $executions

  onMount(() => {
    console.log("Initial executions:", $executions)
  })
</script>

<div class="h-full w-full bg-background relative">
  <!-- Canvas background with dots -->
  <div
    class="absolute inset-0 z-0"
    style="background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 2px, transparent 0); background-size: 24px 24px;"
  />

  {#if executionList && executionList.length > 0}
    <div class="relative z-10 flex flex-col gap-2">
      {#each executionList as execution (execution.run_id)}
        <DraggableCollapsible {execution}>
          <div class="gap-2 flex flex-col">
            <UserInputModal run_id={execution.run_id} />
            <PreviewPane run_id={execution.run_id} />
            <ChatsStream run_id={execution.run_id} />
          </div>
        </DraggableCollapsible>
      {/each}
    </div>
  {:else}
    <div
      class="flex items-center justify-center h-full text-center text-muted-foreground text-sm p-4"
    >
      <p>No executions available</p>
    </div>
  {/if}

  <!-- Debug output -->
</div>
