<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import IngestCrawl from "./IngestCrawl.svelte"
  import ParentChat from "./ParentChat.svelte"

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
    <ResizablePane
      defaultSize={1 / 3}
      minSize={30}
      class="border-r border-border"
    >
      <ScrollArea class="h-[calc(100vh-8rem)]">
        <div class="h-full w-full p-4">
          <IngestCrawl {form} {data} />
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
