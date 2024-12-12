<script lang="ts">
</script>

<!-- Knowledge Processing Card - Top Left
<div class="absolute left-20 top-32 animate-float-slow z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-12deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[-10deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex items-center gap-3">
      <div
        class="w-8 h-8 bg-primary/5 backdrop-blur-xl rounded-lg flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300"
      >
        <span class="text-primary">🔍</span>
      </div>
      <div class="text-sm font-medium text-foreground/80">
        Processing knowledge chunks
        <span class="inline-block animate-pulse">...</span>
      </div>
    </div>
  </div>
</div>
 -->
<!-- Vector Embedding Card - Top Right
<div class="absolute right-32 top-48 animate-float z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[8deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[6deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex items-center gap-3">
      <div
        class="w-8 h-8 bg-primary/5 backdrop-blur-xl rounded-lg flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300"
      >
        <span class="text-primary">🧬</span>
      </div>
      <div class="text-sm font-medium text-foreground/80">
        Vector embeddings generated
      </div>
    </div>
  </div>
</div>
 -->
<!-- Chat Interface Card - Bottom Left -->
<!-- <div class="absolute left-16 top-48 animate-float-slow z-[99]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[7deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[5deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3 w-64">
      <div class="flex gap-2 items-start">
        <div
          class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs"
        >
          AI
        </div>
        <div
          class="bg-background/50 rounded-lg p-2 text-xs text-foreground/70 max-w-[80%]"
        >
          Based on the documentation, you can initialize the vector store
          using...
        </div>
      </div>
      <div class="flex gap-2 items-start justify-end">
        <div
          class="bg-primary/10 rounded-lg p-2 text-xs text-foreground/70 max-w-[80%]"
        >
          How do I set up the vector store?
        </div>
        <div
          class="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs"
        >
          U
        </div>
      </div>
    </div>
  </div>
</div> -->

<div class="absolute left-32 top-[6rem] animate-float mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-18deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[-22deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80"
          >Source Citations</span
        >
        <span
          class="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full"
          >Verified</span
        >
      </div>
      <div class="space-y-2">
        <div class="bg-background/50 p-2 rounded-lg border border-foreground/5">
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
            >
              View
            </button>
          </div>
        </div>
        <div class="flex gap-1 text-xs">
          <span
            class="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full"
            >98% Match</span
          >
          <span class="bg-background/50 px-2 py-1 rounded-full"
            >Last updated: 2h ago</span
          >
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Analytics Card - Bottom Right -->
<div class="absolute right-32 top-32 animate-float mt-16 z-[99]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[6deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[10deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between gap-4">
        <span class="text-sm font-medium text-foreground/80"
          >RAG Performance</span
        >
        <span
          class="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full"
          >Live</span
        >
      </div>
      <div class="space-y-2">
        <div
          class="flex justify-between items-center text-xs text-foreground/70"
        >
          <span>Response Time</span>
          <span class="text-primary">238ms</span>
        </div>
        <div
          class="flex justify-between items-center text-xs text-foreground/70"
        >
          <span>Relevance Score</span>
          <span class="text-primary">96%</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Document Processing Card -->
<div class="absolute left-32 top-[32rem] animate-float mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[4deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[2deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-foreground/80"
          >Document Processing</span
        >
        <span
          class="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full"
          >Active</span
        >
      </div>
      <div class="space-y-2">
        <div
          class="flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-foreground/5"
        >
          <span class="text-blue-500">📄</span>
          <div class="flex-1">
            <div class="text-xs font-medium text-foreground/70">
              technical_docs.pdf
            </div>
            <div class="w-full h-1 bg-blue-500/20 rounded-full mt-1">
              <div
                class="h-full w-[75%] bg-blue-500 rounded-full animate-pulse"
              />
            </div>
          </div>
          <span class="text-xs text-foreground/60">75%</span>
        </div>
        <div class="flex gap-2 text-xs text-foreground/60">
          <span class="bg-background/50 px-2 py-1 rounded-full">Chunking</span>
          <span class="bg-background/50 px-2 py-1 rounded-full">→</span>
          <span class="bg-background/50 px-2 py-1 rounded-full">Embedding</span>
          <span class="bg-background/50 px-2 py-1 rounded-full">→</span>
          <span class="bg-background/50 px-2 py-1 rounded-full">Indexing</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Knowledge Graph Card -->
<div class="absolute right-48 top-[34rem] animate-float mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-5deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[-3deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between gap-6">
        <span class="text-sm font-medium text-foreground/80"
          >Knowledge Graph</span
        >
        <span
          class="text-xs bg-violet-500/20 text-violet-500 px-2 py-0.5 rounded-full"
          >Connected</span
        >
      </div>
      <div class="h-32 w-full bg-background/40 rounded-lg p-2 relative">
        {#each Array(5) as _, i}
          <div
            class="absolute w-4 h-4 bg-violet-500/20 rounded-full"
            style="left: {20 + Math.random() * 80}%; top: {20 +
              Math.random() * 60}%"
          >
            <div
              class="w-2 h-2 bg-violet-500 rounded-full m-1 animate-pulse"
            ></div>
          </div>
          <div
            class="absolute w-[1px] bg-violet-500/20"
            style="left: {30 + Math.random() * 60}%; top: {20 +
              Math.random() * 60}%; 
                      width: 40px; transform: rotate({Math.random() * 360}deg)"
          ></div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- <div class="absolute left-80 top-[50rem] animate-float-slow mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[6deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[4deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80"
          >Model Settings</span
        >
        <span
          class="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full"
          >Advanced</span
        >
      </div>
      <div class="space-y-2">
        <div class="flex flex-col gap-1">
          <div class="flex justify-between text-xs text-foreground/70">
            <span>Temperature</span>
            <span>0.7</span>
          </div>
          <input
            type="range"
            class="w-full h-1 bg-yellow-500/20 rounded-full appearance-none cursor-pointer"
            value="70"
          />
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between text-xs text-foreground/70">
            <span>Context Window</span>
            <span>4K</span>
          </div>
          <div class="w-full h-1 bg-yellow-500/20 rounded-full">
            <div class="h-full w-[40%] bg-yellow-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="absolute left-96 top-[58rem] animate-float-slow mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[8deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[6deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80">Text Chunks</span>
        <span
          class="text-xs bg-pink-500/20 text-pink-500 px-2 py-0.5 rounded-full"
          >Optimizing</span
        >
      </div>
      <div class="space-y-1.5">
        {#each Array(3) as _, i}
          <div
            class="bg-background/50 p-2 rounded-lg border border-foreground/5"
          >
            <div class="flex items-center justify-between mb-1">
              <div class="text-xs text-foreground/70">Chunk {i + 1}</div>
              <div class="text-xs text-pink-500">
                {150 + Math.floor(Math.random() * 100)} tokens
              </div>
            </div>
            <div class="flex gap-1">
              {#each Array(8) as _}
                <div class="h-1 flex-1 rounded-full bg-pink-500/20">
                  <div
                    class="h-full bg-pink-500 rounded-full"
                    style="width: {30 + Math.random() * 70}%"
                  />
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<div class="absolute right-96 top-[62rem] animate-float mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-9deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[-7deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80">System Health</span
        >
        <span
          class="text-xs bg-teal-500/20 text-teal-500 px-2 py-0.5 rounded-full"
          >Monitoring</span
        >
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-background/50 p-2 rounded-lg border border-foreground/5">
          <div class="text-xs text-foreground/70 mb-1">Memory Usage</div>
          <div class="flex items-end gap-0.5 h-12">
            {#each Array(6) as _}
              <div
                class="w-2 bg-teal-500/20 rounded-t-sm transition-all duration-500"
                style="height: {30 + Math.random() * 70}%"
              >
                <div
                  class="w-full h-full bg-teal-500/40 transform origin-bottom animate-pulse"
                />
              </div>
            {/each}
          </div>
        </div>
        <div class="bg-background/50 p-2 rounded-lg border border-foreground/5">
          <div class="text-xs text-foreground/70 mb-1">Queue Status</div>
          <div class="relative h-12 flex items-center justify-center">
            <div class="absolute inset-0 flex items-center justify-center">
              <svg
                class="w-8 h-8 text-teal-500/20 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <span class="text-xs text-teal-500 z-10">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="absolute left-[28rem] top-[66rem] animate-float-slow mt-16 z-[9999]"
>
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[5deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[3deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80"
          >Response Quality</span
        >
        <span
          class="text-xs bg-indigo-500/20 text-indigo-500 px-2 py-0.5 rounded-full"
          >AI Metrics</span
        >
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-xs text-foreground/70">
              <span>Coherence</span>
              <span class="text-indigo-500">98%</span>
            </div>
            <div class="h-1.5 bg-indigo-500/20 rounded-full">
              <div class="h-full w-[98%] bg-indigo-500 rounded-full" />
            </div>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"
          >
            <span class="text-xs text-indigo-500">A+</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-background/50 p-2 rounded-lg text-center">
            <div class="text-foreground/70">Factual</div>
            <div class="text-indigo-500 font-medium">96%</div>
          </div>
          <div class="bg-background/50 p-2 rounded-lg text-center">
            <div class="text-foreground/70">Relevant</div>
            <div class="text-indigo-500 font-medium">99%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="absolute left-[32rem] top-[70rem] animate-float mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[7deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[5deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80">Integrations</span>
        <span
          class="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full"
          >Connected</span
        >
      </div>
      <div class="space-y-2">
        <div class="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
          <div
            class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center"
          >
            <span class="text-orange-500">📘</span>
          </div>
          <div class="flex-1">
            <div class="text-xs font-medium text-foreground/70">Confluence</div>
            <div class="text-xs text-foreground/50">12 spaces synced</div>
          </div>
          <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
          <div
            class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center"
          >
            <span class="text-orange-500">📑</span>
          </div>
          <div class="flex-1">
            <div class="text-xs font-medium text-foreground/70">Notion</div>
            <div class="text-xs text-foreground/50">8 databases connected</div>
          </div>
          <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="absolute right-[32rem] top-[74rem] animate-float-slow mt-16 z-[9999]"
>
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-6deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[-4deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80">Content Sync</span>
        <span
          class="text-xs bg-lime-500/20 text-lime-500 px-2 py-0.5 rounded-full"
          >Real-time</span
        >
      </div>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between text-xs text-foreground/70"
        >
          <span>Last sync</span>
          <span class="text-lime-500">2 minutes ago</span>
        </div>
        <div class="relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-lime-500/20 via-lime-500/10 to-transparent animate-pulse rounded-lg"
          ></div>
          <div class="relative flex items-center gap-2 py-2">
            {#each Array(6) as _, i}
              <div class="w-1.5 h-1.5 rounded-full bg-lime-500/40"></div>
              {#if i !== 5}
                <div class="flex-1 h-[1px] bg-lime-500/20"></div>
              {/if}
            {/each}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-background/50 p-2 rounded-lg text-center">
            <div class="text-foreground/70">Documents</div>
            <div class="text-lime-500 font-medium">1,234</div>
          </div>
          <div class="bg-background/50 p-2 rounded-lg text-center">
            <div class="text-foreground/70">Changes</div>
            <div class="text-lime-500 font-medium">+28</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="absolute left-[36rem] top-[78rem] animate-float mt-16 z-[9999]">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[8deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[6deg]"
  >
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
                rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />
    <div class="relative flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-foreground/80"
          >Usage Analytics</span
        >
        <span
          class="text-xs bg-fuchsia-500/20 text-fuchsia-500 px-2 py-0.5 rounded-full"
          >This Week</span
        >
      </div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">2.4k</div>
            <div class="text-xs text-foreground/70">Queries</div>
          </div>
          <div class="bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">98%</div>
            <div class="text-xs text-foreground/70">Success</div>
          </div>
          <div class="bg-background/50 p-2 rounded-lg">
            <div class="text-2xl font-semibold text-fuchsia-500">1.2s</div>
            <div class="text-xs text-foreground/70">Avg Time</div>
          </div>
        </div>
        <div class="h-16 flex items-end gap-1">
          {#each Array(14) as _}
            <div
              class="flex-1 bg-fuchsia-500/20 rounded-t-sm transition-all duration-300"
              style="height: {20 + Math.random() * 80}%"
            >
              <div
                class="w-full h-full bg-fuchsia-500/40 transform origin-bottom hover:scale-y-110 transition-transform"
              ></div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div> -->

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
