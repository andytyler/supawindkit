<script lang="ts">
  import { onMount } from "svelte"

  let tags: any[] = []
  let loading = true
  let errorMessage: string | null = null

  onMount(async () => {
    try {
      const response = await fetch("/api/tags")
      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }
      const data = await response.json()
      tags = data.results
    } catch (err) {
      console.error("Error fetching tags:", err)
      errorMessage = "Failed to load tags. Please try again later."
    } finally {
      loading = false
    }
  })
</script>

<div class="mt-4">
  <h2 class="text-xl font-semibold mb-2">Tags</h2>
  {#if loading}
    <p class="text-gray-600">Loading tags...</p>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else if tags.length === 0}
    <p class="text-gray-600">No tags found.</p>
  {:else}
    <ul class="flex flex-wrap gap-2">
      {#each tags as tag}
        <li class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {tag.title}
        </li>
      {/each}
    </ul>
  {/if}
</div>
