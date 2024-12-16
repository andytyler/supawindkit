<script lang="ts">
  import FloatingCards from "./FloatingCards.svelte"

  import { Button } from "$components/ui/button"
  import { DotBackground } from "$components/ui/GridAndDotBackground"
  import { WebsiteBaseUrl, WebsiteDescription, WebsiteName } from "$config"
  import {
    ArrowRight,
    BookOpen,
    Bot,
    Search,
    Sparkles,
    Zap,
  } from "lucide-svelte"
  import InteractionCards from "./InteractionCards.svelte"

  const features = [
    {
      id: "ai",
      icon: Bot,
      title: "AI-Powered Answers",
      desc: "Get instant, accurate responses from your documentation",
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    },
    {
      id: "search",
      icon: Search,
      title: "Smart Search",
      desc: "Find exactly what you need with semantic search",
      gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    },
    {
      id: "content",
      icon: BookOpen,
      title: "Easy Integration",
      desc: "Connect your docs, wikis, and knowledge bases in minutes",
      gradient: "from-green-500/20 via-green-500/10 to-transparent",
    },
    {
      id: "analytics",
      icon: Zap,
      title: "Always Up-to-Date",
      desc: "Automatic syncing ensures responses reflect your latest content",
      gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
      tag: "Coming Soon",
    },
  ]

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${JSON.stringify(ldJson) + "<"}/script>`
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta name="description" content={WebsiteDescription} />
  {@html jsonldScript}
</svelte:head>

<DotBackground showFade={true}>
  <main class="relative min-h-screen bg-transparent antialiased">
    <div class="relative w-screen">
      <!-- Hide FloatingCards on mobile -->
      <div class="hidden xl:block">
        <FloatingCards />
      </div>
      <!-- Enhanced gradient background -->
      <div class="absolute inset-0 w-full">
        <div
          class="absolute inset-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                 from-white/10 sm:from-white/20
                 via-background/20 sm:via-background/40
                 to-transparent
                 bg-[length:100%_100%] sm:bg-auto hidden sm:block"
        ></div>
      </div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-16 sm:pb-24 w-full"
      >
        <!-- Main Content -->
        <div class="relative z-10 text-center">
          <!-- New Announcement Pill -->
          <div class="flex justify-center mb-8 sm:mb-16 mt-8">
            <a
              href="/blog"
              class="group relative flex items-center gap-2 px-4 sm:px-6 py-2.5
                     bg-gradient-to-r from-card via-card to-card
                     hover:from-primary/20 hover:via-primary/10 hover:to-primary/20
                     backdrop-blur-md
                     border border-primary/20
                     rounded-full
                     transition-all duration-500 ease-out hover:scale-[1.02]
                     shadow-[0_0_15px_rgba(var(--primary),0.1)] hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]
                     text-xs sm:text-sm text-foreground/90"
            >
              <!-- Animated glow effect -->
              <div
                class="absolute inset-0 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/20 blur-xl
                       opacity-0 group-hover:opacity-10 transition-opacity duration-500"
              />

              <!-- Content wrapper -->
              <div class="relative flex items-center gap-2">
                <Sparkles class="h-4 w-4 text-primary animate-pulse" />
                <span class="font-semibold tracking-wide">
                  New: AI-powered knowledge base chat
                </span>
                <ArrowRight
                  class="h-4 w-0 group-hover:w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 
                         transition-all duration-300 ease-out"
                />
              </div>
            </a>
          </div>

          <!-- Enhanced Title -->
          <h1
            class="max-w-4xl mx-auto text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-8"
          >
            <span class="block text-foreground leading-tight">Chat to your</span
            >
            <span class="text-primary font-bold text-nowrap"
              >knowledge base</span
            >
            <span class="block text-foreground/90 leading-tight"> with AI</span>
          </h1>

          <p
            class="max-w-2xl mx-auto text-xl sm:text-lg lg:text-xl text-foreground/60 mb-8 sm:mb-12 leading-relaxed px-4"
          >
            Chat to your knowledgebase to get answers to your questions.
          </p>

          <!-- Enhanced CTAs -->
          <div
            class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-24 sm:mb-28 px-4 mt-16"
          >
            <Button href="/chat" size="lg" class="w-full sm:w-auto">
              Start Now Free
              <ArrowRight
                class="inline-block ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
            <Button
              variant="outline"
              href="#cal"
              size="lg"
              class="w-full sm:w-auto"
            >
              Speak to a human
            </Button>
          </div>

          <!-- Enhanced Feature Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-24 sm:mt-28 max-w-6xl mx-auto px-4"
          >
            {#each features as feature}
              <div
                class="group relative overflow-hidden rounded-3xl
                       bg-black/40 hover:bg-black/50
                       border border-white/5
                       transition-all duration-300 ease-out
                       backdrop-blur-sm
                       flex flex-col items-center text-center
                       p-8
                       shadow-lg hover:shadow-xl
                       hover:-translate-y-0.5"
              >
                <!-- Subtle glow effect -->
                <div
                  class="absolute inset-0 opacity-0 group-hover:opacity-100
                         bg-gradient-to-t {feature.gradient}
                         transition-opacity duration-300 -z-10"
                />

                <!-- Top section with icon and title -->
                <div class="flex flex-col items-center gap-4 mb-4">
                  <!-- Icon wrapper -->
                  <div
                    class="relative flex items-center justify-center
                           w-14 h-14
                           group-hover:scale-105
                           transition-transform duration-300"
                  >
                    <svelte:component
                      this={feature.icon}
                      class="w-8 h-8 text-white/90 group-hover:text-white
                             transition-colors duration-300"
                    />
                  </div>

                  <!-- Title and tag -->
                  <div class="flex flex-col items-center gap-2">
                    <h3 class="font-semibold text-xl text-white/90">
                      {feature.title}
                    </h3>

                    {#if feature.tag}
                      <span
                        class="px-3 py-1 text-xs font-medium
                               bg-amber-500/10 text-amber-500
                               rounded-full border border-amber-500/20"
                      >
                        {feature.tag}
                      </span>
                    {/if}
                  </div>
                </div>

                <!-- Divider -->
                <div class="w-12 h-px bg-white/10 my-4" />

                <!-- Description -->
                <p class="text-white/60 text-sm leading-relaxed">
                  {feature.desc}
                </p>

                <!-- Optional: Learn More link -->
                <div
                  class="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Button
                    variant="link"
                    href={`#${feature.id}`}
                    class="text-primary/80 hover:text-primary text-sm flex items-center gap-1"
                  >
                    Learn more
                    <svelte:component this={ArrowRight} class="w-4 h-4" />
                  </Button>
                </div>

                <!-- Highlight line -->
                <div
                  class="absolute bottom-0 left-0 h-[2px] w-0
                         bg-gradient-to-r {feature.gradient}
                         group-hover:w-full transition-all duration-300"
                />

                <!-- Corner accent -->
                <div
                  class="absolute top-0 right-0 w-24 h-24
                         bg-gradient-to-bl {feature.gradient}
                         opacity-0 group-hover:opacity-10
                         transition-opacity duration-300
                         -z-10"
                />
              </div>
            {/each}
          </div>
          <div class="flex flex-col items-center justify-center mt-28">
            <h2
              class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4"
            >
              How it works
            </h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chat to your knowledgebase to get answers to your questions.
            </p>
            <InteractionCards />
          </div>
          <!-- Cal.com Section -->
          <div id="cal" class="mt-16 sm:mt-24 mx-auto px-4 h-full">
            <div class="text-center mb-8 sm:mb-12">
              <h2
                class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4"
              >
                Book a Demo Call
              </h2>
              <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                Schedule a personalized demo with our team to see how we can
                help you succeed.
              </p>
            </div>

            <div class="flex flex-col items-center justify-center">
              <div
                class="w-full bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
              >
                <iframe
                  title="cal"
                  src="https://cal.com/andytyler/30min"
                  class="w-full min-h-[600px] sm:min-h-[700px]"
                  style="border: none;"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</DotBackground>

<style>
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
</style>
