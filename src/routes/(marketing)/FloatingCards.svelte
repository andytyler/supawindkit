<script lang="ts">
</script>

<!-- Floating Cards -->
<div class="absolute left-10 top-20 animate-float-slow">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[-12deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[-10deg]"
  >
    <!-- Decorative gradient orb -->
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
             rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />

    <div class="relative flex items-center gap-3">
      <div
        class="w-8 h-8 bg-primary/5 backdrop-blur-xl rounded-lg flex items-center justify-center
               group-hover:scale-110 transition-transform duration-300"
      >
        <span class="text-primary">✨</span>
      </div>
      <div class="text-sm font-medium text-foreground/80">
        Searching Knowledgebase
        <span class="inline-block animate-pulse">...</span>
      </div>
    </div>
  </div>
</div>

<div class="absolute right-10 top-40 animate-float">
  <div
    class="group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg rotate-[8deg]
           border border-foreground/10 hover:border-foreground/20 transition-all duration-300
           hover:shadow-xl hover:-translate-y-1 hover:rotate-[6deg]"
  >
    <!-- Decorative gradient orb -->
    <div
      class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-green-500/20 to-transparent
             rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
    />

    <div class="relative flex items-center gap-3">
      <div
        class="w-8 h-8 bg-green-500/5 backdrop-blur-xl rounded-lg flex items-center justify-center
               group-hover:scale-110 transition-transform duration-300"
      >
        <span class="text-green-500">📈</span>
      </div>
      <div class="text-sm font-medium text-foreground/80">
        Engagement up by 47%
      </div>
    </div>
  </div>
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
