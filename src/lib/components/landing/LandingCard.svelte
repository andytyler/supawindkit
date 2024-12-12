<script lang="ts">
  export let colSpan: string = "col-span-12 md:col-span-4" // Default column span
  export let height: string = "h-[450px]" // Default height
</script>

<div
  class="{colSpan} group relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg
         border border-foreground/10 hover:border-foreground/20 transition-all duration-300 {height}"
>
  <div
    class="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent
           rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"
  />
  <div class="relative flex flex-col h-full gap-4">
    <slot />
  </div>
</div>
