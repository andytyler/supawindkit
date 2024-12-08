<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { Button } from "$components/ui/button"

  // This should come from your auth store or layout data
  export let user = {
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://github.com/shadcn.png",
  }
</script>

<div class="min-h-screen flex flex-col">
  <header class="border-b">
    <div class="flex h-16 items-center px-4 container mx-auto">
      <div class="flex items-center gap-4 flex-1">
        <a href="/" class="font-semibold text-xl">Supafetch</a>
        
        <nav class="hidden md:flex items-center gap-6 mx-6">
          <a href="/chat" class="text-sm font-medium hover:text-primary">Chat</a>
          <a href="/docs" class="text-sm font-medium hover:text-primary">Docs</a>
          <a href="/settings" class="text-sm font-medium hover:text-primary">Settings</a>
        </nav>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button
            variant="ghost"
            builders={[builder]}
            class="relative flex items-center gap-2 h-8 px-3 rounded-full hover:bg-accent"
          >
            <Avatar.Root class="h-8 w-8">
              <Avatar.Image
                src={user.imageUrl}
                alt={user.name}
                class="object-cover"
              />
              <Avatar.Fallback class="bg-muted">{user.name.charAt(0)}</Avatar.Fallback>
            </Avatar.Root>
            <span class="text-sm font-medium">{user.name}</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56" align="end">
          <DropdownMenu.Label class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">{user.name}</p>
              <p class="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <a href="/account/settings" class="w-full">Profile</a>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <a href="/account/billing" class="w-full">Billing</a>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <a href="/account/settings" class="w-full">Settings</a>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <a href="/account/sign_out" class="w-full">Log out</a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </header>

  <main class="flex-1">
    <slot />
  </main>
</div>
