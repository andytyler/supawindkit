<script lang="ts">
  import LandingCard from "$lib/components/landing/LandingCard.svelte"
  import { onMount } from "svelte"

  let isVisible = {
    search: false,
    ai: false,
    content: false,
    analytics: false,
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible[entry.target.id as keyof typeof isVisible] = true
          }
        })
      },
      { threshold: 0.1 },
    )

    ;["search", "ai", "content", "analytics"].forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  })
</script>

<div class="w-full max-w-7xl mx-auto p-4 space-y-16 pt-16">
  <!-- Search & Discovery Section -->
  <section id="search" class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-foreground/90">
        Search & Discovery
      </h2>
      <p class="text-foreground/60">
        Powerful search capabilities with intelligent results
      </p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Search UI Card -->
      <LandingCard colSpan="col-span-12 md:col-span-4" height="h-[450px]">
        <div class="flex flex-col h-full gap-4">
          <!-- Search Input -->
          <div
            class="flex items-center gap-2 bg-background/50 rounded-lg p-3 border border-foreground/10 hover:border-primary/20 transition-colors"
          >
            <span class="text-primary">🔍</span>
            <input
              type="text"
              placeholder="Search knowledge base..."
              class="flex-1 bg-transparent text-sm text-foreground/70 outline-none placeholder:text-foreground/50"
            />
            <kbd class="hidden sm:flex text-[10px] bg-muted px-2 py-0.5 rounded"
              >⌘K</kbd
            >
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5">
            {#each ["Technical", "Documentation", "API", "Guides"] as tag}
              <button
                class="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                {tag}
              </button>
            {/each}
          </div>

          <!-- Recent Searches -->
          <div class="flex-1 space-y-3">
            <div class="text-sm font-medium text-foreground/70">
              Recent Searches
            </div>
            {#each Array(4) as _, i}
              <button
                class="w-full group bg-background/50 p-3 rounded-lg border border-foreground/5 hover:border-primary/20 transition-colors"
              >
                <div class="text-sm text-foreground/70 flex items-center gap-2">
                  <span
                    class="text-primary group-hover:rotate-12 transition-transform"
                    >🕒</span
                  >
                  <span class="truncate"
                    >Vector store configuration {i + 1}</span
                  >
                </div>
              </button>
            {/each}
          </div>
        </div>
      </LandingCard>

      <!-- Results Card -->
      <LandingCard colSpan="col-span-12 md:col-span-3" height="h-[450px]">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-foreground/80"
              >Top Results</span
            >
            <span
              class="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full"
              >5 matches</span
            >
          </div>

          <div class="flex-1 space-y-4">
            {#each [{ title: "📄 Getting Started Guide", relevance: 98, time: "2h" }, { title: "📚 API Reference", relevance: 95, time: "1h" }, { title: "🔧 Configuration Guide", relevance: 92, time: "3h" }, { title: "📱 Mobile Integration", relevance: 88, time: "5h" }, { title: "🚀 Performance Tips", relevance: 85, time: "6h" }] as result}
              <button
                class="w-full group bg-background/50 p-3 rounded-lg border border-foreground/5 hover:border-primary/20 transition-colors"
              >
                <div class="flex justify-between items-start mb-2">
                  <span
                    class="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors"
                    >{result.title}</span
                  >
                  <span class="text-xs text-primary">{result.relevance}%</span>
                </div>
                <div class="h-1 bg-primary/10 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full"
                    style="width: {result.relevance}%"
                  />
                </div>
                <div class="text-xs text-foreground/50 mt-2">
                  Updated {result.time} ago
                </div>
              </button>
            {/each}
          </div>
        </div>
      </LandingCard>

      <!-- Knowledge Graph Card -->
      <LandingCard colSpan="col-span-12 md:col-span-5" height="h-[450px]">
        <div class="flex flex-col h-full gap-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-foreground/80"
              >Knowledge Graph</span
            >
            <span
              class="text-xs bg-violet-500/20 text-violet-500 px-2 py-0.5 rounded-full"
              >Connected</span
            >
          </div>

          <div class="flex-1 bg-background/40 rounded-lg p-4 relative">
            {#each Array(12) as _, i}
              <!-- Node -->
              <div
                class="absolute w-8 h-8 bg-violet-500/20 rounded-full transition-all duration-300 hover:scale-110"
                style="left: {10 + Math.random() * 80}%; top: {10 +
                  Math.random() * 60}%"
              >
                <div
                  class="w-4 h-4 bg-violet-500 rounded-full m-2 animate-pulse"
                />
              </div>

              <!-- {#each Array(2) as _}
                <div
                  class="absolute w-[1px] border border-violet-500/20 transition-opacity duration-300 hover:bg-violet-500/40"
                  style="left: {20 + Math.random() * 60}%; 
                            top: {20 + Math.random() * 60}%; 
                            width: 60px; 
                            transform: rotate({Math.random() * 360}deg)"
                />
              {/each} -->
            {/each}
          </div>
        </div>
      </LandingCard>
    </div>
  </section>

  <!-- AI Intelligence Section -->
  <section id="ai" class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-foreground/90">AI Intelligence</h2>
      <p class="text-foreground/60">
        Advanced AI features for smarter interactions
      </p>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Chat Interface Card -->
      <LandingCard colSpan="col-span-12 md:col-span-5" height="h-[500px]">
        <div class="flex-1 flex flex-col gap-3">
          {#each Array(4) as _, i}
            <div
              class="flex gap-2 items-start {i % 2 === 0 ? '' : 'justify-end'}"
            >
              <div
                class="w-6 h-6 rounded-full {i % 2 === 0
                  ? 'bg-primary/20'
                  : 'bg-foreground/10'} 
                          flex items-center justify-center text-xs"
              >
                {i % 2 === 0 ? "AI" : "U"}
              </div>
              <div
                class="bg-{i % 2 === 0
                  ? 'background/50'
                  : 'primary/10'} rounded-lg p-2
                          text-xs text-foreground/70 max-w-[80%]"
              >
                {i % 2 === 0
                  ? "Here's a detailed explanation of the vector store setup..."
                  : "Could you explain more about the configuration options?"}
              </div>
            </div>
          {/each}
        </div>
        <div class="mt-auto pt-3 border-t border-foreground/10">
          <div class="flex gap-2 items-center bg-background/50 rounded-lg p-2">
            <input
              type="text"
              placeholder="Type your message..."
              class="flex-1 bg-transparent text-xs text-foreground/70 outline-none"
            />
            <button
              class="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full"
              >Send</button
            >
          </div>
        </div>
      </LandingCard>

      <!-- AI Response Quality Card -->
      <LandingCard colSpan="col-span-12 md:col-span-4" height="h-[500px]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-foreground/80"
              >Response Quality</span
            >
            <div
              class="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full"
            >
              High
            </div>
          </div>
          <span
            class="text-xs bg-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded-full"
            >AI Metrics</span
          >
        </div>
        <div class="flex-1 space-y-4">
          <div class="flex items-center gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex justify-between text-xs text-foreground/70">
                <span>Coherence Score</span>
                <span class="text-indigo-500 font-medium">98%</span>
              </div>
              <div class="h-2 bg-indigo-500/20 rounded-full overflow-hidden">
                <div
                  class="h-full w-[98%] bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                />
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20"
            >
              <span class="text-lg font-bold text-indigo-500">A+</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 text-xs">
            <div
              class="bg-background/50 p-3 rounded-lg text-center border border-foreground/5 hover:border-indigo-500/20 transition-colors"
            >
              <div class="text-foreground/70 mb-1">Factual Accuracy</div>
              <div class="text-indigo-500 font-medium text-lg">96%</div>
            </div>
            <div
              class="bg-background/50 p-3 rounded-lg text-center border border-foreground/5 hover:border-indigo-500/20 transition-colors"
            >
              <div class="text-foreground/70 mb-1">Relevance</div>
              <div class="text-indigo-500 font-medium text-lg">99%</div>
            </div>
            <div
              class="bg-background/50 p-3 rounded-lg text-center border border-foreground/5 hover:border-indigo-500/20 transition-colors"
            >
              <div class="text-foreground/70 mb-1">Clarity</div>
              <div class="text-indigo-500 font-medium text-lg">97%</div>
            </div>
          </div>

          <div
            class="flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-foreground/5"
          >
            <span class="text-indigo-500">💡</span>
            <span class="text-xs text-foreground/70"
              >Response quality is consistently high across all metrics</span
            >
          </div>
        </div>
      </LandingCard>

      <!-- Model Configuration Card -->
      <LandingCard colSpan="col-span-12 md:col-span-3" height="h-[500px]">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground/80"
            >Model Settings</span
          >
          <span
            class="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full"
            >Advanced</span
          >
        </div>
        <div class="flex-1 space-y-4">
          {#each [{ label: "Temperature", value: 0.7, max: 1 }, { label: "Context Window", value: 4, max: 8, unit: "K" }, { label: "Top P", value: 0.9, max: 1 }, { label: "Frequency Penalty", value: 0.5, max: 2 }] as setting}
            <div class="flex flex-col gap-2">
              <div class="flex justify-between text-xs text-foreground/70">
                <span>{setting.label}</span>
                <span>{setting.value}{setting.unit || ""}</span>
              </div>
              <div class="w-full h-1.5 bg-yellow-500/20 rounded-full">
                <div
                  class="h-full bg-yellow-500 rounded-full"
                  style="width: {(setting.value / setting.max) * 100}%"
                />
              </div>
            </div>
          {/each}
        </div>
      </LandingCard>
    </div>
  </section>

  <!-- Content Management Section -->
  <section id="content" class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-foreground/90">
        Content Management
      </h2>
      <p class="text-foreground/60">
        Efficient document processing and organization
      </p>
      <div class="flex items-center gap-2 justify-center">
        <span
          class="text-xs bg-amber-500/10 backdrop-blur-sm text-amber-500 px-2 py-1 rounded-full border border-amber-500/20"
        >
          Coming Soon
        </span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- Document Processing Card -->
      <LandingCard colSpan="col-span-12 md:col-span-5" height="h-[400px]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-foreground/80"
            >Document Processing</span
          >
          <span
            class="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full"
            >Active</span
          >
        </div>
        <div class="flex-1 space-y-4">
          <div
            class="flex items-center gap-2 bg-background/50 p-3 rounded-lg border border-foreground/5"
          >
            <span class="text-blue-500">📄</span>
            <div class="flex-1">
              <div class="text-xs font-medium text-foreground/70">
                technical_docs.pdf
              </div>
              <div class="w-full h-1.5 bg-blue-500/20 rounded-full mt-2">
                <div
                  class="h-full w-[75%] bg-blue-500 rounded-full animate-pulse"
                />
              </div>
            </div>
            <span class="text-xs text-foreground/60">75%</span>
          </div>
          <div class="flex gap-2 text-xs text-foreground/60">
            <span class="bg-background/50 px-2 py-1 rounded-full">Chunking</span
            >
            <span class="bg-background/50 px-2 py-1 rounded-full">→</span>
            <span class="bg-background/50 px-2 py-1 rounded-full"
              >Embedding</span
            >
            <span class="bg-background/50 px-2 py-1 rounded-full">→</span>
            <span class="bg-background/50 px-2 py-1 rounded-full">Indexing</span
            >
          </div>
        </div>
      </LandingCard>

      <!-- Citation Card -->
      <LandingCard colSpan="col-span-12 md:col-span-4" height="h-[400px]">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground/80"
            >Source Citations</span
          >
          <span
            class="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full"
            >Verified</span
          >
        </div>
        <div class="flex-1 space-y-4">
          <div
            class="bg-background/50 p-3 rounded-lg border border-foreground/5"
          >
            <div class="flex items-center gap-2">
              <span class="text-emerald-500">📚</span>
              <div class="text-xs text-foreground/70 flex-1">
                <div class="font-medium">Technical Documentation v2.1</div>
                <div class="text-foreground/50">
                  Page 42, Section: API Reference
                </div>
              </div>
              <button
                class="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full"
                >View</button
              >
            </div>
          </div>
          <div class="flex gap-2 text-xs">
            <span
              class="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full"
              >98% Match</span
            >
            <span class="bg-background/50 px-2 py-1 rounded-full"
              >Last updated: 2h ago</span
            >
          </div>
        </div>
      </LandingCard>

      <!-- Integration Status Card -->
      <LandingCard colSpan="col-span-12 md:col-span-3" height="h-[400px]">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground/80"
            >Integrations</span
          >
          <span
            class="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full"
            >Connected</span
          >
        </div>
        <div class="flex-1 space-y-3">
          {#each [{ name: "Confluence", icon: "📘", details: "12 spaces synced", color: "orange" }, { name: "Notion", icon: "📑", details: "8 databases connected", color: "orange" }, { name: "SharePoint", icon: "📁", details: "5 sites connected", color: "orange" }, { name: "Google Drive", icon: "📁", details: "3 folders synced", color: "orange" }] as integration}
            <div
              class="flex items-center gap-2 bg-background/50 p-2 rounded-lg"
            >
              <div
                class="w-8 h-8 rounded-lg bg-{integration.color}-500/10 flex items-center justify-center"
              >
                <span class="text-{integration.color}-500"
                  >{integration.icon}</span
                >
              </div>
              <div class="flex-1">
                <div class="text-xs font-medium text-foreground/70">
                  {integration.name}
                </div>
                <div class="text-xs text-foreground/50">
                  {integration.details}
                </div>
              </div>
              <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          {/each}
        </div>
      </LandingCard>
    </div>
  </section>

  <!-- Analytics & Performance Section -->
  <section id="analytics" class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold text-foreground/90">
        Analytics & Performance
      </h2>
      <p class="text-foreground/60">Real-time insights and monitoring</p>
      <div class="flex items-center gap-2 justify-center">
        <span
          class="text-xs bg-amber-500/10 backdrop-blur-sm text-amber-500 px-2 py-1 rounded-full border border-amber-500/20"
        >
          Coming Soon
        </span>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4">
      <!-- RAG Performance Card -->
      <LandingCard colSpan="col-span-12 md:col-span-3" height="h-[300px]">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground/80"
            >RAG Performance</span
          >
          <span
            class="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full"
            >Live</span
          >
        </div>
        <div class="flex-1 flex flex-col justify-center space-y-4 mt-2">
          <div
            class="flex justify-between items-center text-sm text-foreground/70"
          >
            <span>Response Time</span>
            <span class="text-green-500">238ms</span>
          </div>
          <div
            class="flex justify-between items-center text-sm text-foreground/70"
          >
            <span>Relevance Score</span>
            <span class="text-yellow-500">96%</span>
          </div>
          <div class="h-32 flex items-end gap-1">
            {#each Array(12) as _}
              <div
                class="flex-1 bg-yellow-500/20 rounded-t-sm transition-all duration-300"
                style="height: {30 + Math.random() * 70}%"
              >
                <div class="w-full h-full bg-yellow-500/40" />
              </div>
            {/each}
          </div>
        </div>
      </LandingCard>

      <!-- Usage Analytics Card -->
      <LandingCard colSpan="col-span-12 md:col-span-6" height="h-[300px]">
        <div class="flex items-start justify-between">
          <div class="space-y-1 text-left">
            <span class="text-sm font-medium text-foreground/80"
              >Usage Analytics</span
            >
            <p class="text-xs text-foreground/60">
              Real-time monitoring of system usage
            </p>
          </div>
          <div class="flex gap-2">
            <span
              class="text-xs bg-fuchsia-500/20 text-fuchsia-500 px-2 py-0.5 rounded-full"
              >This Week</span
            >
            <span
              class="text-xs bg-card text-card-foreground border border-border px-2 py-0.5 rounded-full"
              >+12% Growth</span
            >
          </div>
        </div>
        <div class="grid grid-cols-4 gap-4 mt-4">
          <div class="space-y-1 bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">2.4k</div>
            <div class="text-xs text-foreground/70">Total Queries</div>
          </div>
          <div class="space-y-1 bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">98%</div>
            <div class="text-xs text-foreground/70">Success Rate</div>
          </div>
          <div class="space-y-1 bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">1.2s</div>
            <div class="text-xs text-foreground/70">Response Time</div>
          </div>
          <div class="space-y-1 bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">89%</div>
            <div class="text-xs text-foreground/70">User Satisfaction</div>
          </div>
        </div>
        <div class="flex-1 flex flex-col mt-4">
          <div class="flex justify-between text-xs text-foreground/70">
            <span>Hourly Query Volume</span>
            <span class="text-fuchsia-500">Peak: 428 queries/hr</span>
          </div>
          <div class="flex-1 flex items-end gap-1 mt-2">
            {#each Array(24) as _}
              <div
                class="flex-1 bg-fuchsia-500/20 rounded-t-sm"
                style="height: {20 + Math.random() * 80}%"
              >
                <div class="w-full h-full bg-fuchsia-500/40" />
              </div>
            {/each}
          </div>
          <div class="flex justify-between text-xs text-foreground/60 mt-2">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </div>
      </LandingCard>

      <!-- Content Sync Card -->
      <LandingCard colSpan="col-span-12 md:col-span-3" height="h-[300px]">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground/80"
            >Content Sync</span
          >
          <span
            class="text-xs bg-lime-500/20 text-lime-500 px-2 py-0.5 rounded-full"
            >Real-time</span
          >
        </div>
        <div class="flex-1 flex flex-col justify-between mt-4">
          <div
            class="flex items-center justify-between text-sm text-foreground/70"
          >
            <span>Last sync</span>
            <span class="text-lime-500">2 minutes ago</span>
          </div>
          <div class="relative my-8">
            <div
              class="absolute inset-0 bg-gradient-to-r from-lime-500/20 via-lime-500/10 to-transparent rounded-lg"
            />
            <div class="relative flex items-center gap-2 py-2">
              {#each Array(6) as _, i}
                <div class="w-2 h-2 rounded-full bg-lime-500/40" />
                {#if i !== 5}
                  <div class="flex-1 h-[1px] bg-lime-500/20" />
                {/if}
              {/each}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-background/50 p-2 rounded-lg">
              <div class="text-foreground/70 text-sm">Documents</div>
              <div class="text-lime-500 text-lg font-medium">1,234</div>
            </div>
            <div class="bg-background/50 p-2 rounded-lg">
              <div class="text-foreground/70 text-sm">Changes</div>
              <div class="text-lime-500 text-lg font-medium">+28</div>
            </div>
          </div>
        </div>
      </LandingCard>
    </div>
  </section>
</div>

<style>
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(8deg);
    }
    50% {
      transform: translateY(-20px) rotate(8deg);
    }
  }

  @keyframes float-slow {
    0%,
    100% {
      transform: translateY(0px) rotate(-12deg);
    }
    50% {
      transform: translateY(-15px) rotate(-12deg);
    }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-slow {
    animation: float 8s ease-in-out infinite;
  }
</style>
