<script lang="ts">
  import ParentChat from "./ParentChat.svelte"

  import {
    PaneGroup,
    ResizableHandle,
    ResizablePane,
  } from "$lib/components/ui/resizable"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { Separator } from "$lib/components/ui/separator"
  // import IngestCrawl from "./IngestCrawl.svelte"

  // export let data: PageData
  // export let form: ActionData

  let selectedContent: { title?: string; content: string } | null = null
</script>

<div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
  <PaneGroup direction="horizontal" class="h-full">
    <ResizablePane
      defaultSize={1 / 3}
      minSize={30}
      class="border-r border-border"
    >
      <ScrollArea class="h-[calc(100vh-8rem)]">
        <div class="h-full w-full p-4">
          <!-- <IngestCrawl {form} /> -->
        </div>
      </ScrollArea>
    </ResizablePane>

    <ResizableHandle withHandle />

    <ResizablePane defaultSize={2 / 3} minSize={30} class="flex flex-col">
      <Separator />
      <div class="flex-1 overflow-hidden">
        <ParentChat />
      </div>
    </ResizablePane>
  </PaneGroup>
</div>

<!-- Add Modal for Full Content -->
{#if selectedContent}
  <dialog
    open
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="max-w-2xl max-h-[80vh] bg-white rounded-md p-4 overflow-auto">
      <h2 class="text-xl font-semibold">
        {selectedContent.title || "Content Details"}
      </h2>
      <p class="mt-4 whitespace-pre-wrap text-muted-foreground">
        {selectedContent.content}
      </p>
      <button
        class="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        on:click={() => (selectedContent = null)}
      >
        Close
      </button>
    </div>
  </dialog>
{/if}
