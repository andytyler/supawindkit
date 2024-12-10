<script lang="ts">
  import { Badge } from "$components/ui/badge"
  import { WebsiteLogo, WebsiteName } from "$config"
  import * as Avatar from "$lib/components/ui/avatar"
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import Moon from "lucide-svelte/icons/moon"
  import Sun from "lucide-svelte/icons/sun"
  import { ModeWatcher, resetMode, setMode } from "mode-watcher"

  // Get data from layout.server.ts
  export let data

  // Destructure the user data from the server
  const { user, profile, isActiveCustomer, currentPlanId } = data

  // Navigation items
  const navItems = [
    // { href: "/chat", label: "Chat" },
    // { href: "/docs", label: "Docs" },
    // { href: "/settings", label: "Settings" },
  ]
</script>

<ModeWatcher />

<div class="min-h-screen flex flex-col">
  <header class="border-b bg-background border-border">
    <div class="mx-4">
      <nav class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <a
          href="/"
          class="text-xl flex items-center gap-2 text-secondary-foreground italic uppercase font-extrabold tracking-tight transition-colors hover:text-primary"
        >
          <div class="flex items-center gap-2 rounded-lg">
            <img
              src={WebsiteLogo}
              alt={WebsiteName + " logo"}
              class="h-8 w-auto invert-0 dark:invert-100 transition-all duration-300 rounded-lg"
            />
          </div>
          <span>{WebsiteName}</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6 mx-6">
          {#each navItems as item}
            <a
              href={item.href}
              class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          {/each}
        </nav>

        <!-- User Menu -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button variant="ghost" builders={[builder]}>
              <Avatar.Root class="h-8 w-8">
                <Avatar.Image
                  src={profile?.avatar_url || user.user_metadata?.avatar_url}
                  alt={profile?.full_name || user.email}
                  class="object-cover"
                />
                <Avatar.Fallback class="bg-muted">
                  {(profile?.full_name || user.email)?.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <span class="text-sm pl-2 font-medium hidden md:inline-block">
                {profile?.full_name || user.email}
              </span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56" align="end">
            <DropdownMenu.Label class="font-normal">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">
                  {profile?.full_name || user.email}
                </p>
                <p class="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">Current Plan</span>
                <Badge
                  variant={isActiveCustomer ? "default" : "outline"}
                  class="text-xs"
                >
                  {isActiveCustomer ? "Pro" : "Free"}
                </Badge>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Item>
                <a href="/account/settings" class="w-full">Profile</a>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <a href="/account/billing" class="w-full">
                  {isActiveCustomer ? "Manage Subscription" : "Upgrade Plan"}
                </a>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <a href="/account/settings" class="w-full">Settings</a>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Label>
              <span class="text-xs text-muted-foreground">Theme</span>
            </DropdownMenu.Label>
            <DropdownMenu.Item on:click={() => setMode("light")}>
              <div class="flex items-center gap-2">
                <Sun class="h-4 w-4" />
                <span>Light</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={() => setMode("dark")}>
              <div class="flex items-center gap-2">
                <Moon class="h-4 w-4" />
                <span>Dark</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={() => resetMode()}>
              <div class="flex items-center gap-2">
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>System</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
              <form action="/account/api?/signout" method="POST" class="w-full">
                <button type="submit" class="w-full text-left">Log out</button>
              </form>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </nav>
    </div>
  </header>

  <main class="flex-1">
    <slot />
  </main>
</div>
