<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import type { Execution } from "$lib/stores/executionStore"
  import { executions } from "$lib/stores/executionStore"
  import { ArrowRight, Globe, Search } from "lucide-svelte"
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
    <div class="relative z-10 flex flex-col gap-4 p-4">
      {#each executionList as execution (execution.run_id)}
        <DraggableCollapsible {execution}>
          <div class="gap-4 flex flex-col">
            <UserInputModal run_id={execution.run_id} />

            <!-- Browser Activity -->
            {#if execution.payload.activity.action_type === "browse"}
              <Card.Root
                class="bg-card/50 backdrop-blur border-l-4 border-l-primary"
              >
                <Card.Header class="pb-2">
                  <div class="flex items-center gap-2">
                    <Globe class="h-4 w-4 text-primary" />
                    <Card.Title class="text-sm font-medium"
                      >Browser Activity</Card.Title
                    >
                  </div>
                  <Card.Description class="flex items-center gap-2 text-xs">
                    <span class="text-muted-foreground">Current URL:</span>
                    <code
                      class="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs"
                    >
                      {execution.payload.activity.start_url || "Loading..."}
                    </code>
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <PreviewPane run_id={execution.run_id} />
                </Card.Content>
              </Card.Root>
            {/if}

            <!-- RAG Activity -->
            {#if execution.payload.activity.action_type === "rag"}
              <Card.Root class="bg-card/50 backdrop-blur ">
                <Card.Header class="pb-2">
                  <div class="flex items-center gap-2">
                    <Search class="h-4 w-4 text-secondary" />
                    <Card.Title class="text-sm font-medium"
                      >Knowledge Search</Card.Title
                    >
                  </div>
                  <Card.Description class="space-y-2">
                    <div class="flex items-center gap-2 text-xs">
                      <span class="text-muted-foreground">Query:</span>
                      <code
                        class="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs"
                      >
                        {execution.payload.activity.query}
                      </code>
                    </div>
                    <!-- {#if execution.payload.activity.context_ids?.length}
                      <div class="flex flex-wrap gap-1">
                        {#each execution.payload.activity.context_ids as tagId}
                          <Badge variant="outline" class="text-xs">
                            {tagId}
                          </Badge>
                        {/each}
                      </div>
                    {/if} -->
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div class="space-y-2">
                    {#if execution.payload.output?.results?.length}
                      {#each execution.payload.output.results as result, i}
                        <div class="group relative">
                          <div
                            class="absolute -left-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50"
                          >
                            <ArrowRight class="h-3 w-3" />
                          </div>
                          <div
                            class="rounded-md border bg-muted/50 p-3 transition-colors hover:bg-muted"
                          >
                            <div
                              class="prose prose-sm dark:prose-invert max-w-none"
                            >
                              {@html result.content}
                            </div>
                            {#if result.source}
                              <div class="mt-2 text-xs text-muted-foreground">
                                Source: {result.source}
                              </div>
                            {/if}
                          </div>
                        </div>
                      {/each}
                    {:else if execution.status === "running"}
                      <div class="text-sm text-muted-foreground">
                        Loading results...
                      </div>
                    {:else if execution.payload.error}
                      <div class="text-sm text-destructive">
                        Error: {execution.payload.error}
                      </div>
                    {:else}
                      <div class="text-sm text-muted-foreground">
                        No results available
                      </div>
                    {/if}
                  </div>
                </Card.Content>
              </Card.Root>
            {/if}

            <!-- Chat Stream -->
            <Card.Root class="bg-card/50 backdrop-blur">
              <Card.Content class="p-0">
                <ChatsStream run_id={execution.run_id} />
              </Card.Content>
            </Card.Root>
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
</div>

<style>
  /* Optional: Add smooth transitions */
  :global(.activity-transition) {
    transition: all 0.2s ease-in-out;
  }

  /* Optional: Add hover effects for interactive elements */
  :global(.activity-card:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
