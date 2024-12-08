<script lang="ts">
  import { Input } from "$components/ui/input"
  import { Label } from "$components/ui/label"
  import Textarea from "$components/ui/textarea/textarea.svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Tabs from "$lib/components/ui/tabs"
  import { superForm } from "sveltekit-superforms/client"
  import type { ActionData, PageData } from "./$types"
  import Tags from "./Tags.svelte"
  export let data: PageData
  export let form: ActionData

  // Initialize SuperForms for Crawl and Text forms
  const {
    form: crawlForm,
    errors: crawlErrors,
    enhance: crawlEnhance,
    message: crawlMessage,
    submitting: crawlSubmitting,
    delayed: crawlDelayed,
  } = superForm(data.crawlForm, {})

  const {
    form: textForm,
    errors: textErrors,
    enhance: textEnhance,
    message: textMessage,
    submitting: textSubmitting,
    delayed: textDelayed,
  } = superForm(data.textForm, {})

  const {
    form: searchForm,
    errors: searchErrors,
    enhance: searchEnhance,
    message: searchMessage,
    submitting: searchSubmitting,
    delayed: searchDelayed,
  } = superForm(data.searchForm, {})
</script>

<Tabs.Root value="crawl" class="w-full">
  <Tabs.List class="grid w-full grid-cols-3 mb-4">
    <Tabs.Trigger value="crawl">Crawl Website</Tabs.Trigger>
    <Tabs.Trigger value="text">Add Text</Tabs.Trigger>
    <Tabs.Trigger value="search">Search Content</Tabs.Trigger>
  </Tabs.List>

  <!-- Crawl Website Tab -->
  <Tabs.Content value="crawl">
    <Card.Root>
      <Card.Header>
        <Card.Title>Crawl Website</Card.Title>
        <Card.Description
          >Enter website details to start crawling</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <form use:crawlEnhance method="POST" action="?/crawl" class="space-y-4">
          <div class="space-y-2">
            <Label for="crawl_title">Crawl Title (no spaces)</Label>
            <Input
              type="text"
              id="crawl_title"
              name="crawl_title"
              bind:value={$crawlForm.crawl_title}
              class="w-full px-3 py-2 border rounded-md"
              pattern="\S+"
            />
            {#if $crawlErrors.crawl_title}
              <span class="text-red-500 text-sm">
                {$crawlErrors.crawl_title}
              </span>
            {/if}
          </div>

          <div class="space-y-2">
            <Label for="input_url">URL to crawl</Label>
            <Input
              type="url"
              id="input_url"
              name="input_url"
              bind:value={$crawlForm.input_url}
              class="w-full px-3 py-2 border rounded-md"
            />
            {#if $crawlErrors.input_url}
              <span class="text-red-500 text-sm">
                {$crawlErrors.input_url}
              </span>
            {/if}
          </div>

          <div class="space-y-2">
            <Label for="depth">Crawl depth</Label>
            <Input
              type="number"
              id="depth"
              name="depth"
              bind:value={$crawlForm.depth}
              min="0"
              max="3"
              class="w-full px-3 py-2 border rounded-md"
            />
            {#if $crawlErrors.depth}
              <span class="text-red-500 text-sm">
                {$crawlErrors.depth}
              </span>
            {/if}
          </div>

          <Button type="submit" disabled={!!$crawlDelayed} class="w-full">
            {$crawlSubmitting ? "Crawling..." : "Start Crawl"}
          </Button>
        </form>

        {#if $crawlMessage}
          <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            {$crawlMessage}
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  </Tabs.Content>

  <!-- Add Text Content Tab -->
  <Tabs.Content value="text">
    <Card.Root>
      <Card.Header>
        <Card.Title>Add Text Content</Card.Title>
        <Card.Description>Enter text content to save</Card.Description>
      </Card.Header>
      <Card.Content>
        <form use:textEnhance method="POST" action="?/text" class="space-y-4">
          <div class="space-y-2">
            <Label for="textTitle">Title (no spaces)</Label>
            <Input
              type="text"
              id="textTitle"
              name="textTitle"
              bind:value={$textForm.textTitle}
              class="w-full px-3 py-2 border rounded-md"
              pattern="\S+"
            />
            {#if $textErrors.textTitle}
              <span class="text-red-500 text-sm">
                {$textErrors.textTitle}
              </span>
            {/if}
          </div>

          <div class="space-y-2">
            <Label for="textContent">Content</Label>
            <Textarea
              id="textContent"
              name="textContent"
              bind:value={$textForm.textContent}
              rows={10}
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your content here..."
            ></Textarea>
            {#if $textErrors.textContent}
              <span class="text-red-500 text-sm">
                {$textErrors.textContent}
              </span>
            {/if}
          </div>

          <Button type="submit" disabled={!!$textDelayed} class="w-full">
            {$textSubmitting ? "Saving..." : "Save Content"}
          </Button>
        </form>

        {#if $textMessage}
          <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            {$textMessage}
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  </Tabs.Content>

  <!-- Search Content Tab remains unchanged -->
  <Tabs.Content value="search">
    <Card.Root>
      <Card.Header>
        <Card.Title>Search Content</Card.Title>
        <Card.Description>Enter text content to search</Card.Description>
      </Card.Header>
      <Card.Content>
        <form
          use:searchEnhance
          method="POST"
          action="?/search"
          class="space-y-4"
        >
          <div class="space-y-2">
            <Label for="searchQuery">Search Query</Label>
            <Input
              type="text"
              id="searchQuery"
              name="searchQuery"
              bind:value={$searchForm.searchQuery}
              class="w-full px-3 py-2 border rounded-md"
            />
            {#if $searchErrors.searchQuery}
              <span class="text-red-500 text-sm">
                {$searchErrors.searchQuery}
              </span>
            {/if}
          </div>

          <input
            type="hidden"
            name="selectedTags"
            bind:value={$searchForm.selectedTags}
          />

          <Tags bind:selectedTags={$searchForm.selectedTags} />

          <Button type="submit" disabled={!!$searchDelayed} class="w-full">
            {$searchSubmitting ? "Searching..." : "Search Content"}
          </Button>

          {#if form?.search_results}
            <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              {JSON.stringify(form.search_results)}
            </div>
          {/if}
        </form>

        {#if $searchMessage}
          <div class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            {$searchMessage}
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  </Tabs.Content>
</Tabs.Root>
