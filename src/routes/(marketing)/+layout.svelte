<script lang="ts">
  import { navigating } from "$app/stores"
  import { WebsiteDescription, WebsiteLogo, WebsiteName } from "$config"
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import ExternalLink from "lucide-svelte/icons/external-link"
  import Moon from "lucide-svelte/icons/moon"
  import Sun from "lucide-svelte/icons/sun"
  import { ModeWatcher, resetMode, setMode } from "mode-watcher"
  import { expoOut } from "svelte/easing"
  import { slide } from "svelte/transition"
  import "./../../app.css"

  function isExternalLink(href: string): boolean {
    return href.startsWith("http") || href.startsWith("https")
  }

  function getFaviconUrl(href: string): string {
    return `https://www.google.com/s2/favicons?domain=${href}&sz=64`
  }

  const footerLinks = {
    quickLinks: {
      title: "Quick Links",
      links: [
        { label: "Blog Posts", href: "/blog" },
        { label: "Company", href: "/blog" },
        { label: "Pricing", href: "/pricing" },
        { label: "Login", href: "/login" },
        { label: "Account", href: "/account" },
      ],
    },
    social_anton: {
      title: "Anton",
      links: [
        // { label: "GitHub", href: "https://github.com" },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/antonmuratov/",
        },
        { label: "Twitter", href: "https://x.com/antonm_x" },
        { label: "Cal", href: "https://cal.com/ant0n" },
      ],
    },
    social_andy: {
      title: "Andy",
      links: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/andrewjtyler/",
        },
        { label: "Twitter", href: "https://x.com/Andy_AJT" },
        { label: "Cal", href: "https://cal.com/andytyler/" },
        { label: "GitHub", href: "https://github.com/andytyler" },
      ],
    },
  }
</script>

<ModeWatcher />

{#if $navigating}
  <div
    class="fixed w-full top-0 right-0 left-0 h-1 z-50 bg-accent"
    in:slide={{ delay: 100, duration: 12000, axis: "x", easing: expoOut }}
  />
{/if}

<div class="min-h-screen flex flex-col">
  <header class="fixed w-full top-0 z-40 backdrop-blur-xl">
    <div class="container mx-auto">
      <nav class="flex h-16 items-center justify-between">
        <a
          href="/"
          class="text-xl flex items-center gap-2 text-secondary-foreground italic uppercase font-extrabold tracking-tight transition-colors hover:text-primary"
        >
          <div class="flex items-center gap-2 rounded-lg">
            <img
              src={WebsiteLogo}
              alt={WebsiteName + " logo"}
              class="h-6 w-auto invert-0 dark:invert-100 transition-all duration-300 rounded-lg"
            />
          </div>
          <span class="text-foreground hover:text-foreground/80 italic"
            >{WebsiteName}</span
          >
        </a>

        <div class="flex items-center gap-6 uppercase">
          {#each [{ label: "App", href: "/chat" }, { label: "Blog", href: "/blog" }, { label: "Search", href: "/" }, { label: "Pricing", href: "/pricing" }, { label: "Login", href: "/login" }] as link}
            <Button
              href={link.href}
              variant="link"
              class="text-sm font-medium transition-colors text-foreground hover:text-foreground/80"
            >
              {link.label}
            </Button>
          {/each}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="ghost"
                size="icon"
                class="h-9 w-9"
              >
                <Sun
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item on:click={() => setMode("light")}>
                Light
              </DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => setMode("dark")}>
                Dark
              </DropdownMenu.Item>
              <DropdownMenu.Item on:click={() => resetMode()}>
                System
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </nav>
    </div>
  </header>
  <div class="">
    <!-- I removed pt-16 from here -->
    <slot />
  </div>

  <footer class="border-t border-border/50 mt-auto">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row justify-between gap-8 py-8">
        <!-- About Section -->
        <div class="max-w-sm">
          <h3 class="font-semibold mb-4">About {WebsiteName}</h3>
          <p class="text-sm text-muted-foreground">
            {WebsiteDescription}
          </p>
        </div>

        <!-- Right side links with gap -->
        <div class="flex flex-col md:flex-row gap-8 md:gap-16">
          {#each Object.entries(footerLinks) as [_, section]}
            <div>
              <h3 class="font-semibold mb-4">{section.title}</h3>
              <ul class="space-y-2">
                {#each section.links as link}
                  <li>
                    <a
                      href={link.href}
                      target={isExternalLink(link.href) ? "_blank" : "_self"}
                      class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      {#if isExternalLink(link.href)}
                        <img
                          src={getFaviconUrl(link.href)}
                          alt=""
                          class="w-4 h-4 opacity-75 dark:invert grayscale rounded"
                          loading="lazy"
                        />
                        <span class="flex items-center gap-1">
                          {link.label}
                          <ExternalLink
                            class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </span>
                      {:else}
                        {link.label}
                      {/if}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>

      <div
        class="mt-8 py-8 px-4 border-t border-border/90 text-left text-sm text-muted-foreground"
      >
        <p>
          © {new Date().getFullYear()} Supafetch. Made with
          <span class="text-pink-700 uppercase font-semibold">Jam</span> by the
          <a
            href="https://spikejam.org"
            target="_blank"
            class=" uppercase hover:underline font-semibold italic">SpikeJam</a
          >
          team.
        </p>
      </div>
    </div>
  </footer>
</div>
