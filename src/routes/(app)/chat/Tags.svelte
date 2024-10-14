<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  let tags: any[] = [];
  let loading = true;
  let errorMessage: string | null = null;
  let selectedTags: number[] = [];

  const dispatch = createEventDispatcher();

  onMount(async () => {
    try {
      const response = await fetch("/api/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      tags = data.results;
    } catch (err) {
      console.error("Error fetching tags:", err);
      errorMessage = "Failed to load tags. Please try again later.";
    } finally {
      loading = false;
    }
  });

  function toggleTag(tagId: number) {
    if (selectedTags.includes(tagId)) {
      selectedTags = selectedTags.filter(id => id !== tagId);
    } else {
      selectedTags = [...selectedTags, tagId];
    }
    dispatch('tagsSelected', { selectedTags });
  }
</script>

<div class="mt-4 mb-8">
  {#if loading}
    <p class="text-gray-600">Loading tags...</p>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else if tags.length === 0}
    <p class="text-gray-600">No tags found.</p>
  {:else}
    <ul class="flex flex-wrap gap-2">
      {#each tags as tag}
        <li
          class="px-2 py-1 rounded-full text-sm cursor-pointer transition-colors duration-200 ease-in-out"
          class:bg-blue-500={selectedTags.includes(tag.id)}
          class:text-white={selectedTags.includes(tag.id)}
          class:bg-blue-100={!selectedTags.includes(tag.id)}
          class:text-blue-800={!selectedTags.includes(tag.id)}
          on:click={() => toggleTag(tag.id)}
        >
          {tag.title}
        </li>
      {/each}
    </ul>
  {/if}
</div>
