<script lang="ts">
  import { DotBackground } from "$lib/components/ui/GridAndDotBackground"
  import { ArrowRight, Sparkles } from "lucide-svelte"
  import { WebsiteBaseUrl, WebsiteDescription, WebsiteName } from "../../config"
  import type { ActionData } from "./$types"

  export let data
  export let form: ActionData

  const features = [
    {
      icon: "🤖",
      title: "Smart Indexing",
      desc: "Automatically indexes and understands your entire website content",
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc: "Get instant answers from your website content",
      gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    },
    {
      icon: "🎯",
      title: "Precise Answers",
      desc: "Context-aware responses from your exact content",
      gradient: "from-green-500/20 via-green-500/10 to-transparent",
    },
    {
      icon: "🔄",
      title: "Always Fresh",
      desc: "Content stays current with automatic updates",
      gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
    },
  ]

  const companies = ["Company 1", "Company 2", "Company 3", "Company 4"]

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta name="description" content={WebsiteDescription} />
  {@html jsonldScript}
</svelte:head>

<main class="relative min-h-screen bg-background antialiased">
  <DotBackground showFade={true}>
    <div class="relative w-full">
      <!-- Enhanced gradient background - make it full width -->
      <div class="absolute inset-0 w-full">
        <div
          class="absolute inset-0 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-background/40 to-background"
        ></div>
      </div>

      <div
        class="relative max-w-7xl mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-32 w-full"
      >
        <!-- Floating Cards -->
        <div class="absolute left-10 top-20 animate-float-slow">
          <div
            class="bg-card backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-12deg]
                      border border-foreground/10 hover:border-foreground/20 transition-all duration-300"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-background/5 rounded-lg flex items-center justify-center"
              >
                <span class="text-foreground/80">🔍</span>
              </div>
              <div class="text-sm text-foreground/80">Indexing website...</div>
            </div>
          </div>
        </div>

        <div class="absolute right-10 top-40 animate-float">
          <div
            class="bg-card backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[8deg]
                      border border-foreground/10 hover:border-foreground/20 transition-all duration-300"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-background/5 rounded-lg flex items-center justify-center"
              >
                <span class="text-foreground/80">💬</span>
              </div>
              <div class="text-sm text-foreground/80">
                AI processing complete
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10 text-center">
          <!-- New Announcement Pill -->
          <div class="flex justify-center mb-16">
            <a
              href="/blog"
              class="group relative flex items-center gap-2 px-4 py-2
                      bg-primary/5 hover:bg-primary/10
                      backdrop-blur-md
                      border border-primary/10
                      rounded-full
                      transition-all duration-300 hover:scale-102
                      text-sm text-foreground/80"
            >
              <Sparkles class="h-3.5 w-3.5 text-primary" />
              <span class="font-medium">
                New: Our AI integration just landed
              </span>
              <ArrowRight
                class="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </a>
          </div>

          <!-- Enhanced Title -->
          <h1
            class="max-w-4xl mx-auto text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            <span class="block text-foreground leading-tight">Perform</span>
            <span
              class="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent
                       animate-gradient-x hover:scale-105 transition-transform duration-300 inline-block"
            >
              RAG
            </span>
            <span class="block text-foreground/90 leading-tight"
              >On Any Website</span
            >
          </h1>

          <p
            class="max-w-2xl mx-auto text-xl text-foreground/60 mb-12 leading-relaxed"
          >
            Transform your website into an intelligent knowledge base. Get
            instant, accurate answers powered by AI.
          </p>

          <!-- Enhanced CTAs -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <a
              href="/dashboard"
              class="group relative px-8 py-4 text-lg font-medium
                      bg-primary hover:bg-primary/90
                      text-primary-foreground rounded-full
                      transition-all duration-300 hover:scale-105
                      shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            >
              Start for Free
              <ArrowRight
                class="inline-block ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href="/demo"
              class="px-8 py-4 text-lg font-medium
                      bg-foreground/5 hover:bg-foreground/10
                      text-foreground rounded-full
                      transition-all duration-300 hover:scale-105
                      border border-foreground/10 hover:border-foreground/20"
            >
              Try Demo
            </a>
          </div>

          <!-- Enhanced Feature Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24 max-w-6xl mx-auto"
          >
            {#each features as feature}
              <div
                class="group relative overflow-hidden rounded-2xl p-8
                          bg-gradient-to-br from-primary/5 via-background to-transparent
                          hover:bg-gradient-to-br hover:from-primary/20 hover:via-primary/5 hover:to-transparent
                          backdrop-blur-xl border border-primary/10 hover:border-primary/30
                          transition-all duration-500
                          shadow-[0_0_15px_rgba(var(--primary),0.1)] hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]"
              >
                <!-- Decorative gradient orb -->
                <div
                  class="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent
                            rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
                ></div>

                <span
                  class="relative text-5xl mb-6 block transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
                >
                  {feature.icon}
                </span>
                <h3 class="relative font-semibold text-lg mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p class="relative text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </DotBackground>
</main>

<style>
  @keyframes gradient-x {
    0%,
    100% {
      background-size: 200% 200%;
      background-position: left center;
    }
    50% {
      background-size: 200% 200%;
      background-position: right center;
    }
  }

  .animate-gradient-x {
    animation: gradient-x 15s ease infinite;
  }
</style>
