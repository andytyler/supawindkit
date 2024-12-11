<script lang="ts">
  import FloatingCards from "./FloatingCards.svelte"

  import { Button } from "$components/ui/button"
  import { DotBackground } from "$components/ui/GridAndDotBackground"
  import { WebsiteBaseUrl, WebsiteDescription, WebsiteName } from "$config"
  import { ArrowRight, Sparkles } from "lucide-svelte"

  const features = [
    {
      icon: "✨",
      title: "AI Caption Generator",
      desc: "Create engaging captions that boost engagement and reach",
      gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    },
    {
      icon: "📊",
      title: "Analytics Insights",
      desc: "Track performance and optimize your content strategy",
      gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    },
    {
      icon: "🎯",
      title: "Smart Scheduling",
      desc: "Post at the perfect time for maximum engagement",
      gradient: "from-green-500/20 via-green-500/10 to-transparent",
    },
    {
      icon: "🔄",
      title: "Multi-Platform",
      desc: "Manage all your social accounts in one place",
      gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
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
      <!-- Enhanced gradient background -->
      <div class="absolute inset-0 w-full">
        <div
          class="absolute inset-0 w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                 from-primary/20 sm:from-primary/40
                 via-background/20 sm:via-background/40
                 to-transparent
                 bg-[length:100%_100%] sm:bg-auto hidden sm:block"
        ></div>
      </div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-16 sm:pb-24 w-full"
      >
        <!-- Hide FloatingCards on mobile -->
        <div class="hidden sm:block">
          <FloatingCards />
        </div>

        <!-- Main Content -->
        <div class="relative z-10 text-center">
          <!-- New Announcement Pill -->
          <div class="flex justify-center mb-8 sm:mb-16">
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
                class="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl
                       opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <!-- Content wrapper -->
              <div class="relative flex items-center gap-2">
                <Sparkles class="h-4 w-4 text-primary animate-pulse" />
                <span class="font-semibold tracking-wide">
                  New: AI-powered knowledgebase chat
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
            class="max-w-4xl mx-auto text-4xl sm:text-5xl md:text-6xl lg:text-9xl font-bold tracking-tight mb-4 sm:mb-8"
          >
            <span class="block text-foreground leading-tight">Chat to your</span
            >
            <span
              class="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent
                        animate-gradient-x hover:scale-105 transition-transform duration-300 inline-block"
            >
              knowledgebase
            </span>
            <span class="block text-foreground/90 leading-tight"> with AI</span>
          </h1>

          <p
            class="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-foreground/60 mb-8 sm:mb-12 leading-relaxed px-4"
          >
            Chat to your knowledgebase to get answers to your questions.
          </p>

          <!-- Enhanced CTAs -->
          <div
            class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 sm:mb-20 px-4"
          >
            <Button href="/dashboard" size="lg" class="w-full sm:w-auto">
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
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-16 sm:mt-24 max-w-6xl mx-auto px-4"
          >
            {#each features as feature}
              <div
                class="group relative overflow-hidden rounded-2xl p-6 sm:p-8
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
                  class="relative text-4xl sm:text-5xl mb-4 sm:mb-6 block transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
                >
                  {feature.icon}
                </span>
                <h3
                  class="relative font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-foreground"
                >
                  {feature.title}
                </h3>
                <p
                  class="relative text-sm sm:text-base text-muted-foreground leading-relaxed"
                >
                  {feature.desc}
                </p>
              </div>
            {/each}
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
