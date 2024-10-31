<script lang="ts">
  import { Button } from "$components/ui/button"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import {
    PaneGroup,
    ResizableHandle,
    ResizablePane,
  } from "$lib/components/ui/resizable"
  import { Separator } from "$lib/components/ui/separator"
  import type { PageData } from "./$types"
  import Chat from "./Chat.svelte"
  import IngestCrawl from "./IngestCrawl.svelte"

  export let data: PageData
  // You'll need to get these from your data/props
  export let user = {
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://github.com/shadcn.png", // Example avatar URL
  }

  let selectedTags: number[] = []

  function handleTagsSelected(event: CustomEvent<{ selectedTags: number[] }>) {
    selectedTags = event.detail.selectedTags
    // Update the chat component with new tags
    if (chat) {
      chat.updateTags(selectedTags)
    }
  }
</script>

<div class="flex flex-col md:flex-row gap-4 h-full">
  <PaneGroup direction="horizontal">
    <ResizablePane defaultSize={1 / 3} minSize={30}>
      <div class="flex items-center justify-between px-4 py-4">
        <h1 class="text-xl font-bold">Knowledge Base</h1>
      </div>
      <Separator />
      <IngestCrawl />
    </ResizablePane>
    <ResizableHandle withHandle />
    <ResizablePane defaultSize={2 / 3} minSize={30}>
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold">Chat</h1>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button
              variant="ghost"
              builders={[builder]}
              class="relative flex items-center gap-2 h-6 px-3 rounded-full hover:bg-accent"
            >
              <Avatar.Root class="h-8 w-8">
                <Avatar.Image
                  src={user.imageUrl}
                  alt={user.name}
                  class="object-cover"
                />
                <Avatar.Fallback class="bg-muted"
                  >{user.name.charAt(0)}</Avatar.Fallback
                >
              </Avatar.Root>
              <span class="text-sm font-medium">{user.name}</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56" align="end">
            <DropdownMenu.Label class="font-normal">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">{user.name}</p>
                <p class="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                <a href="/account/settings">Profile</a>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <a href="/account/billing">Billing</a>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <a href="/account/settings">Settings</a>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <a href="/account/sign_out">Log out</a>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <Separator />

      <div class="">
        <Chat />
      </div>
    </ResizablePane>
  </PaneGroup>
</div>
