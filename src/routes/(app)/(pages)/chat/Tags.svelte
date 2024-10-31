<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"

  let tags: Array<{ id: number; title: string }> = []
  let loading = true
  let errorMessage: string | null = null
  let selectedTags: number[] = []

  const dispatch = createEventDispatcher<{
    tagsSelected: { selectedTags: number[] }
  }>()

  onMount(async () => {
    try {
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      if (Array.isArray(data.results)) {
        tags = data.results
      } else {
        console.error("Unexpected tags format:", data)
        errorMessage = "Invalid tags data received"
      }
    } catch (err) {
      console.error("Error fetching tags:", err)
      errorMessage = "Failed to load tags. Please try again later."
    } finally {
      loading = false
    }
  })

  function toggleTag(tagId: number) {
    selectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId]
    dispatch("tagsSelected", { selectedTags: selectedTags })
  }

  function clearTags() {
    selectedTags = []
    dispatch("tagsSelected", { selectedTags: [] })
  }
</script>

<div class="space-y-2">
  <div class="flex items-center justify-between">
    <label class="text-sm font-medium text-muted-foreground">Context Tags</label
    >
    {#if selectedTags.length > 0}
      <button
        class="text-xs text-muted-foreground hover:text-foreground transition-colors"
        on:click={clearTags}
      >
        Clear all
      </button>
    {/if}
  </div>

  {#if loading}
    <p class="text-sm text-muted-foreground">Loading tags...</p>
  {:else if errorMessage}
    <p class="text-sm text-destructive">{errorMessage}</p>
  {:else if tags.length === 0}
    <p class="text-sm text-muted-foreground">No tags found.</p>
  {:else}
    <ul class="flex flex-wrap gap-1.5">
      {#each tags as tag}
        <li>
          <button
            type="button"
            class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200
              {selectedTags.includes(tag.id)
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'}"
            on:click={() => toggleTag(tag.id)}
          >
            {tag.title}
            {#if selectedTags.includes(tag.id)}
              <span class="ml-1 text-xs opacity-60">✓</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
