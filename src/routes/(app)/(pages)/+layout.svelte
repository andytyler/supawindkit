<script lang="ts">
  let isOpen = false

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
  ]
</script>

<!-- Top Navigation Bar -->
<!-- <nav class="bg-background border-b">
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex-shrink-0">
          <img class="h-8 w-8" src="/logo.png" alt="SuperFetch Logo" />
        </a>
        <div class="hidden md:block ml-10">
          {#each navItems as item}
            <Button
              variant="ghost"
              asChild
              class={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                $page.url.pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <a href={item.href}>{item.label}</a>
            </Button>
          {/each}
        </div>
      </div>
      <div class="hidden md:block">
        <Button size="icon" variant="ghost">
          <Bell class="h-5 w-5" />
          <span class="sr-only">View notifications</span>
        </Button>
      </div>
      <div class="md:hidden">
        <Sheet.Root bind:open={isOpen}>
          <Sheet.Trigger asChild>
            <Button variant="ghost" size="icon">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Open menu</span>
            </Button>
          </Sheet.Trigger>
          <Sheet.Content side="left" class="w-[300px] sm:w-[400px]">
            <nav class="flex flex-col gap-4">
              {#each navItems as item}
                <a
                  href={item.href}
                  class={cn(
                    "block px-2 py-1 text-lg",
                    $page.url.pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </a>
              {/each}
            </nav>
          </Sheet.Content>
        </Sheet.Root>
      </div>
    </div>
  </div>
</nav> -->

<!-- Main Content Area -->
<div class="flex h-screen min-h-full overflow-hidden">
  <!-- h-[calc(100vh-4rem)] -->
  <!-- Main Content -->
  <main class="flex-1 bg-background h-full">
    <slot />
  </main>
</div>
