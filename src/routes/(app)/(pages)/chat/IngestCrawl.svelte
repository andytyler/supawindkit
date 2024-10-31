<script lang="ts">
  import { invalidateAll } from "$app/navigation"
  import * as Card from "$lib/components/ui/card"
  import * as Tabs from "$lib/components/ui/tabs"
  import Snippet from "./Snippet.svelte"
  import Tags from "./Tags.svelte"

  let loading = false
  let success = false
  let error: string | null = null
  let searchError: string | null = null
  let searchQuery = ""
  let searchResults: any[] = []
  let searching = false
  let input_url = ""
  let depth = 0
  let crawl_title = "" // New variable for the crawl title
  let selectedTagIds: number[] = []

  let textContent = ""
  let textTitle = ""
  let textLoading = false
  let textSuccess = false
  let textError: string | null = null

  const handleCrawl = async (event: Event) => {
    event.preventDefault()
    loading = true
    success = false
    error = null

    // Validate that the title has no spaces
    if (crawl_title.includes(" ")) {
      error = "Title must not contain spaces."
      loading = false
      return
    }

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_url, depth, crawl_title }), // Include crawl_title in the request
      })

      const result = await response.json()

      if (response.ok && result.success) {
        success = true
        console.log(result.message)
        await invalidateAll()
      } else {
        error = result.error || "An error occurred while crawling the website."
      }
    } catch (err) {
      console.error("Crawl error:", err)
      error = "An unexpected error occurred."
    } finally {
      loading = false
    }
  }

  function handleTagsSelected(event: CustomEvent) {
    selectedTagIds = event.detail.selectedTags
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return

    searching = true
    searchError = null
    try {
      // Update the URL construction to ensure proper encoding
      const params = new URLSearchParams({
        query: searchQuery,
        tagIds: JSON.stringify(selectedTagIds),
        limit: "5",
      })
      const response = await fetch(`/api/crawl?${params.toString()}`)
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      searchResults = data.results
    } catch (err) {
      console.error("Search error:", err)
      searchError = "An error occurred while searching."
    } finally {
      searching = false
    }
  }

  const handleAddText = async (event: Event) => {
    event.preventDefault()
    textLoading = true
    textSuccess = false
    textError = null

    // Validate that the title has no spaces
    if (textTitle.includes(" ")) {
      textError = "Title must not contain spaces."
      textLoading = false
      return
    }

    try {
      const response = await fetch("/api/add-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: textContent,
          title: textTitle,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        textSuccess = true
        textContent = ""
        textTitle = ""
        await invalidateAll()
      } else {
        textError =
          result.error || "An error occurred while saving the content."
      }
    } catch (err) {
      console.error("Save error:", err)
      textError = "An unexpected error occurred."
    } finally {
      textLoading = false
    }
  }
</script>

<div class="max-w-4xl mt-8 mx-4">
  <Tabs.Root value="crawl" class="w-full">
    <Tabs.List class="grid w-full grid-cols-3 mb-4">
      <Tabs.Trigger value="crawl">Crawl Website</Tabs.Trigger>
      <Tabs.Trigger value="text">Add Text</Tabs.Trigger>
      <Tabs.Trigger value="search">Search Content</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="crawl">
      <Card.Root>
        <Card.Header>
          <Card.Title>Crawl Website</Card.Title>
          <Card.Description
            >Enter website details to start crawling</Card.Description
          >
        </Card.Header>
        <Card.Content>
          <form on:submit={handleCrawl} class="space-y-4">
            <div>
              <label
                for="crawl_title"
                class="block text-sm font-medium text-foreground"
                >Crawl Title (no spaces)</label
              >
              <input
                type="text"
                id="crawl_title"
                bind:value={crawl_title}
                pattern="\S+"
                title="Title must not contain spaces"
                class="input input-bordered w-full"
              />
            </div>

            <div>
              <label
                for="input_url"
                class="block text-sm font-medium text-foreground"
                >URL to crawl</label
              >
              <input
                type="url"
                id="input_url"
                bind:value={input_url}
                required
                class="input input-bordered w-full"
              />
            </div>

            <div>
              <label
                for="depth"
                class="block text-sm font-medium text-foreground"
                >Crawl depth</label
              >
              <input
                type="number"
                id="depth"
                bind:value={depth}
                min="0"
                max="3"
                required
                class="input input-bordered w-full"
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

          {#if loading}
            <div class="mt-4 text-center">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
              ></div>
              <p class="mt-2 text-muted-foreground">
                Crawling website, please wait...
              </p>
            </div>
          {/if}

          {#if success}
            <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              Crawl completed successfully!
            </div>
          {/if}

          {#if error}
            <div
              class="mt-4 p-4 bg-destructive text-destructive-foreground rounded-md"
            >
              {error}
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="text">
      <Card.Root>
        <Card.Header>
          <Card.Title>Add Text Content</Card.Title>
          <Card.Description>Enter text content to save</Card.Description>
        </Card.Header>
        <Card.Content>
          <form on:submit={handleAddText} class="space-y-4">
            <div>
              <label
                for="text_title"
                class="block text-sm font-medium text-foreground"
                >Title (no spaces)</label
              >
              <input
                type="text"
                id="text_title"
                bind:value={textTitle}
                pattern="\S+"
                title="Title must not contain spaces"
                required
                class="input input-bordered w-full"
              />
            </div>

            <div>
              <label
                for="text_content"
                class="block text-sm font-medium text-foreground">Content</label
              >
              <textarea
                id="text_content"
                bind:value={textContent}
                required
                rows="10"
                class="textarea textarea-bordered w-full"
                placeholder="Enter your content here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={textLoading}
              class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
            >
              {textLoading ? "Saving..." : "Save Content"}
            </button>
          </form>

          {#if textLoading}
            <div class="mt-4 text-center">
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
              ></div>
              <p class="mt-2 text-muted-foreground">
                Saving content, please wait...
              </p>
            </div>
          {/if}

          {#if textSuccess}
            <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              Content saved successfully!
            </div>
          {/if}

          {#if textError}
            <div
              class="mt-4 p-4 bg-destructive text-destructive-foreground rounded-md"
            >
              {textError}
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="search">
      <Card.Root>
        <Card.Header>
          <Card.Title>Search Content</Card.Title>
          <Card.Description
            >Search through your ingested content</Card.Description
          >
        </Card.Header>
        <Card.Content>
          <Tags on:tagsSelected={handleTagsSelected} />

          <div class="flex space-x-2 mt-4">
            <form
              on:submit|preventDefault={handleSearch}
              class="flex space-x-2 w-full"
            >
              <input
                type="text"
                bind:value={searchQuery}
                placeholder="Enter search query"
                class="flex-grow px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={searching}
                class="btn btn-secondary"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {#if searchResults.length > 0}
            <div class="mt-4 space-y-4">
              <h3 class="text-lg font-semibold">Search Results:</h3>
              <div class="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                {#each searchResults as snippet}
                  <Snippet {snippet} />
                {/each}
              </div>
            </div>
          {:else if searching}
            <p class="mt-4 text-muted-foreground">Searching...</p>
          {:else if searchQuery && !searching}
            <p class="mt-4 text-muted-foreground">No results found.</p>
          {/if}

          {#if searchError}
            <p
              class="mt-4 p-4 bg-destructive text-destructive-foreground rounded-md"
            >
              {searchError}
            </p>
          {/if}
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>
