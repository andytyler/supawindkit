<script lang="ts">
  import { enhance } from "$app/forms"
  import type { ActionData } from "./$types"

  export let form: ActionData
</script>

<form
  method="POST"
  use:enhance
  class="relative z-10 mt-8 flex flex-col items-center gap-4 w-full max-w-md px-4"
>
  <div class="relative w-full">
    <input
      type="email"
      name="email"
      placeholder="Enter your email"
      required
      class="w-full px-4 py-3 rounded-lg bg-neutral-900/50 border border-neutral-800 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all"
    />
    <button
      type="submit"
      class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Join Waitlist
    </button>
  </div>
  {#if form?.message}
    <p class="text-sm text-neutral-300">{form.message}</p>
  {/if}
</form>
