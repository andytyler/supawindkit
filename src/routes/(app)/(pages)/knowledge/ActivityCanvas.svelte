<script lang="ts">
  import { executions } from "$lib/stores/executionStore"
  import { onMount } from "svelte"
  import ChatsStream from "./ChatsStream.svelte"
  import PreviewPane from "./PreviewPane.svelte"
  import UserInputModal from "./UserInputModal.svelte"

  let executionList: any[] = []

  // Use reactive statement instead of direct subscription
  $: executionList = $executions

  onMount(() => {
    console.log("Initial executions:", $executions)
  })
</script>

<div class="h-full w-full bg-background relative p-4">
  <!-- Canvas background with dots -->
  <div
    class="absolute inset-0 z-0"
    style="background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.05) 2px, transparent 0); background-size: 24px 24px;"
  />

  {#if executionList && executionList.length > 0}
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
    >
      {#each executionList as execution (execution.run_id)}
        <div
          class="group hover:scale-[1.02] transition-all duration-200 bg-background/60 backdrop-blur-md rounded-xl p-6 shadow-lg border border-border/50 hover:border-primary/20 hover:shadow-primary/5"
        >
          <h2
            class="text-lg font-medium text-foreground/80 mb-4 flex items-center gap-2"
          >
            <span class="h-2 w-2 rounded-full bg-primary/80 animate-pulse" />
            Execution {execution.run_id}
          </h2>
          <div class="space-y-5">
            <PreviewPane run_id={execution.run_id} />
            <ChatsStream run_id={execution.run_id} />
            <UserInputModal run_id={execution.run_id} />
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center p-4">
      <p>No executions available</p>
    </div>
  {/if}

  <!-- Debug output -->
</div>
