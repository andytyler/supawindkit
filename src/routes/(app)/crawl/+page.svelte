<script lang="ts">
  import { enhance } from "$app/forms"
  import { invalidateAll } from "$app/navigation"

  let loading = false
  let success = false
  let error: string | null = null
  let searchQuery = ""
  let searchResults: any[] = []
  let searching = false

  const handleSubmit = () => {
    loading = true
    success = false
    error = null
    return async ({ result }) => {
      loading = false
      if (result.type === "success") {
        success = true
        console.log(result.data.message) // Log the message from the server
        await invalidateAll()
      } else {
        error = "An error occurred while crawling the website."
      }
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return

    searching = true
    try {
      const response = await fetch(
        `/crawl?query=${encodeURIComponent(searchQuery)}&limit=5`,
      )
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      searchResults = data.results
    } catch (err) {
      console.error("Search error:", err)
      error = "An error occurred while searching."
    } finally {
      searching = false
    }
  }
</script>

<div
  class="max-w-2xl mx-auto mt-8 p-6 bg-background text-foreground rounded-lg shadow-md"
>
  <h1 class="text-2xl font-bold mb-4">Website Crawler</h1>

  <form method="POST" use:enhance={handleSubmit} class="space-y-4 mb-8">
    <div>
      <label for="input_url" class="block text-sm font-medium text-foreground"
        >URL to crawl</label
      >
      <input
        type="url"
        id="input_url"
        name="input_url"
        required
        class="mt-1 block w-full rounded-md border-input shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
      />
    </div>

    <div>
      <label for="depth" class="block text-sm font-medium text-foreground"
        >Crawl depth</label
      >
      <input
        type="number"
        id="depth"
        name="depth"
        min="0"
        max="10"
        required
        class="mt-1 block w-full rounded-md border-input shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
    >
      {loading ? "Crawling..." : "Start Crawl"}
    </button>
  </form>

  <!-- New search section -->
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-4">Search Crawled Content</h2>
    <div class="flex space-x-2">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Enter search query"
        class="flex-grow px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        on:click={handleSearch}
        disabled={searching}
        class="px-4 py-2 bg-primary primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
      >
        {searching ? "Searching..." : "Search"}
      </button>
    </div>

    <!-- Search results -->
    {#if searchResults.length > 0}
      <div class="mt-4 space-y-4">
        <h3 class="text-lg font-semibold">Search Results:</h3>
        {#each searchResults as result}
          <div class="p-4 bg-muted text-muted-foreground rounded-md">
            <p class="text-sm mb-2">
              Similarity: {result.similarity.toFixed(2)}
            </p>
            <p>{result.content}</p>
          </div>
        {/each}
      </div>
    {:else if searching}
      <p class="mt-4 text-muted-foreground">Searching...</p>
    {:else if searchQuery && !searching}
      <p class="mt-4 text-muted-foreground">No results found.</p>
    {/if}
  </div>

  {#if loading}
    <div class="mt-4 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
      ></div>
      <p class="mt-2 text-muted-foreground">Crawling website, please wait...</p>
    </div>
  {/if}

  {#if success}
    <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
      Crawl completed successfully!
    </div>
  {/if}

  {#if error}
    <div class="mt-4 p-4 bg-destructive text-destructive-foreground rounded-md">
      {error}
    </div>
  {/if}
</div>
