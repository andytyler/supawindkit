<script lang="ts">
  import { GridAndDotBackground } from "$components/ui/GridAndDotBackground"
  import { ArrowRight } from "lucide-svelte"
  import { WebsiteBaseUrl, WebsiteDescription, WebsiteName } from "../../config"
  import type { ActionData } from "./$types"

  export let data
  export let form: ActionData

  const features = [
    { icon: "🤖", title: "AI-Powered", desc: "Natural conversations" },
    { icon: "⚡", title: "Quick Setup", desc: "Ready in minutes" },
    { icon: "🔄", title: "Auto-Updates", desc: "Always in sync" },
    { icon: "🎯", title: "Custom Training", desc: "Your content, your way" },
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

<main
  class="min-h-screen bg-background antialiased overflow-hidden selection:bg-primary/30 selection:text-foreground"
>
  <div class="relative">
    <GridAndDotBackground>
      <!-- Enhanced gradient background -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background"
      />

      <div class="relative min-h-screen flex flex-col">
        <div class="flex-1 flex items-center">
          <div class="w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div class="flex flex-col items-center text-center space-y-16">
              <!-- Enhanced Hero Badge -->
              <div
                class="group relative overflow-hidden rounded-full bg-card/30 backdrop-blur-md border border-border/50 px-6 py-3
                          shadow-lg hover:shadow-primary/20 transition-all duration-500 hover:scale-105"
              >
                <span
                  class="relative z-10 text-sm font-medium bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                >
                  🧠 Any Website, All Knowledge →
                </span>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              <!-- Epic Hero Title -->
              <div class="space-y-8">
                <h1
                  class="font-bold tracking-tight text-6xl md:text-7xl lg:text-8xl [text-wrap:balance] leading-tight"
                >
                  <div
                    class="relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
                  >
                    <span
                      class="block text-foreground drop-shadow-[0_0_25px_rgba(var(--primary),0.3)] transition-all duration-300 hover:scale-105"
                    >
                      Perform
                    </span>
                    <span
                      class="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
                    >
                      RAG
                    </span>
                  </div>
                  <span
                    class="mt-2 md:mt-4 block text-foreground drop-shadow-[0_0_25px_rgba(var(--primary),0.3)] transition-all duration-300 hover:scale-105"
                  >
                    On Any Website
                  </span>
                </h1>

                <p
                  class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
                >
                  Transform any website content into an interactive AI chatbot.
                  Not just 1 page - the whole site!
                </p>
              </div>

              <!-- Enhanced CTA Buttons -->
              <div
                class="flex flex-col sm:flex-row gap-6 min-w-[380px] justify-center"
              >
                <a
                  href="/dashboard"
                  class="group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 text-base font-medium
                          bg-primary text-primary-foreground rounded-full transition-all duration-300
                          hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20
                          border border-primary/20"
                >
                  Start for Free
                  <ArrowRight
                    class="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
                <a
                  href="/demo"
                  class="inline-flex items-center justify-center px-8 py-4 text-base font-medium
                          border border-border rounded-full transition-all duration-300
                          hover:bg-card/50 hover:border-primary/50 hover:scale-105 backdrop-blur-sm
                          hover:shadow-lg hover:shadow-primary/20"
                >
                  See it in Action
                </a>
              </div>

              <!-- Enhanced Feature Grid -->
              <div
                class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto"
              >
                {#each features as feature}
                  <div
                    class="group relative overflow-hidden rounded-2xl bg-card/30 backdrop-blur-md border border-border/50
                              p-6 transition-all duration-300 hover:scale-105 hover:bg-card/50
                              hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50"
                  >
                    <span
                      class="text-4xl block group-hover:scale-110 transition-transform duration-300"
                      >{feature.icon}</span
                    >
                    <h3 class="font-semibold text-foreground mt-4">
                      {feature.title}
                    </h3>
                    <p class="text-sm text-muted-foreground mt-2">
                      {feature.desc}
                    </p>
                  </div>
                {/each}
              </div>

              <!-- Enhanced Social Proof -->
              <div class="pt-16 border-t border-border/50 w-full">
                <p
                  class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-lg font-medium mb-8"
                >
                  Trusted by innovative teams
                </p>
                <div class="flex justify-center items-center space-x-12">
                  {#each companies as company}
                    <span
                      class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {company}
                    </span>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridAndDotBackground>
  </div>
</main>
