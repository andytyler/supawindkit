<script lang="ts">
  import { invalidateAll } from "$app/navigation"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import { Input } from "$lib/components/ui/input"
  import * as Tabs from "$lib/components/ui/tabs"
  import { Textarea } from "$lib/components/ui/textarea"

  let loading = false
  let success = false
  let error: string | null = null
  let input_url = ""
  let depth = 0
  let crawl_title = ""

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
        body: JSON.stringify({ input_url, depth, crawl_title }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        success = true
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

  const handleAddText = async (event: Event) => {
    event.preventDefault()
    textLoading = true
    textSuccess = false
    textError = null

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

<div class="p-4">
  <Tabs.Root value="crawl" class="w-full">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="crawl">Crawl Website</Tabs.Trigger>
      <Tabs.Trigger value="text">Add Text</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="crawl" class="mt-4">
      <Card.Root>
        <Card.Header>
          <Card.Title>Crawl Website</Card.Title>
          <Card.Description
            >Enter website details to start crawling</Card.Description
          >
        </Card.Header>
        <Card.Content>
          <form on:submit|preventDefault={handleCrawl} class="space-y-4">
            <div class="space-y-2">
              <label for="crawl_title" class="text-sm font-medium">
                Crawl Title (no spaces)
              </label>
              <Input
                type="text"
                id="crawl_title"
                bind:value={crawl_title}
                pattern="\S+"
                title="Title must not contain spaces"
              />
            </div>

            <div class="space-y-2">
              <label for="input_url" class="text-sm font-medium">
                URL to crawl
              </label>
              <Input
                type="url"
                id="input_url"
                bind:value={input_url}
                required
                placeholder="https://example.com"
              />
            </div>

            <div class="space-y-2">
              <label for="depth" class="text-sm font-medium">
                Crawl depth
              </label>
              <Input
                type="number"
                id="depth"
                bind:value={depth}
                min="0"
                max="3"
                required
              />
            </div>

            <Button type="submit" disabled={loading} class="w-full">
              {loading ? "Crawling..." : "Start Crawl"}
            </Button>

            {#if success}
              <div class="rounded-md bg-green-50 p-4 text-sm text-green-700">
                Crawl completed successfully!
              </div>
            {/if}

            {#if error}
              <div
                class="rounded-md bg-destructive/15 p-4 text-sm text-destructive"
              >
                {error}
              </div>
            {/if}
          </form>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>

    <Tabs.Content value="text" class="mt-4">
      <Card.Root>
        <Card.Header>
          <Card.Title>Add Text Content</Card.Title>
          <Card.Description>Enter text content to save</Card.Description>
        </Card.Header>
        <Card.Content>
          <form on:submit|preventDefault={handleAddText} class="space-y-4">
            <div class="space-y-2">
              <label for="text_title" class="text-sm font-medium">
                Title (no spaces)
              </label>
              <Input
                type="text"
                id="text_title"
                bind:value={textTitle}
                pattern="\S+"
                title="Title must not contain spaces"
                required
              />
            </div>

            <div class="space-y-2">
              <label for="text_content" class="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="text_content"
                bind:value={textContent}
                required
                rows={10}
                placeholder="Enter your content here..."
              />
            </div>

            <Button type="submit" disabled={textLoading} class="w-full">
              {textLoading ? "Saving..." : "Save Content"}
            </Button>

            {#if textSuccess}
              <div class="rounded-md bg-green-50 p-4 text-sm text-green-700">
                Content saved successfully!
              </div>
            {/if}

            {#if textError}
              <div
                class="rounded-md bg-destructive/15 p-4 text-sm text-destructive"
              >
                {textError}
              </div>
            {/if}
          </form>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</div>
