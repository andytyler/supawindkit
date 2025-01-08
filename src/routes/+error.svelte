<script>
  import { page } from "$app/stores"
  import "../app.css"
</script>

<div class="flex items-center justify-center min-h-[100vh]">
  <div class="flex flex-col items-center p-4">
    <div class="max-w-lg text-center">
      <h1 class="text-5xl font-bold text-foreground">
        Something is not right...
      </h1>
      <p class="py-6 text-2xl text-muted-foreground">
        There was an error: {$page?.error?.message}
      </p>
      <div>
        <a
          href="/"
          class="inline-block px-8 py-3 font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  </div>
</div>
