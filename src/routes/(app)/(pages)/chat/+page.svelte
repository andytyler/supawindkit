<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import IngestCrawl from "./IngestCrawl.svelte"
  import ParentChat from "./ParentChat.svelte"

  import { Button } from "$lib/components/ui/button"
  import {
    PaneGroup,
    ResizableHandle,
    ResizablePane,
  } from "$lib/components/ui/resizable"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { Separator } from "$lib/components/ui/separator"
  // Icon

  export let data: PageData
  export let form: ActionData
</script>

<div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
  <PaneGroup direction="horizontal" class="h-full">
    <ResizablePane defaultSize={1 / 3} minSize={30} class="border-r">
      <ScrollArea class="h-[calc(100vh-8rem)]">
        <div class="h-full w-full p-4">
          <IngestCrawl {form} {data} />
        </div>
      </ScrollArea>
    </ResizablePane>

    <ResizableHandle withHandle />

    <ResizablePane defaultSize={2 / 3} minSize={30} class="flex flex-col">
      <div class="flex items-center justify-between p-4">
        <h1 class="text-xl font-semibold tracking-tight">Chat</h1>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <i class="i-lucide-trash-2 mr-2 h-4 w-4" />
            Clear Chat
          </Button>
          <Button variant="outline" size="sm">
            <i class="i-lucide-download mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />
      <div class="flex-1 overflow-hidden">
        <ParentChat />
      </div>
    </ResizablePane>
  </PaneGroup>
</div>
