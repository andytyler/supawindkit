<script lang="ts">
  import ParentChat from "./ParentChat.svelte"

  import { Input } from "$components/ui/input"
  import { Label } from "$components/ui/label"
  import { Textarea } from "$components/ui/textarea"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import {
    PaneGroup,
    ResizableHandle,
    ResizablePane,
  } from "$lib/components/ui/resizable"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { Separator } from "$lib/components/ui/separator"
  import * as Tabs from "$lib/components/ui/tabs"
  import { superForm } from "sveltekit-superforms"
  import type { PageData } from "./$types"

  // export let form: ActionData
  export let data: PageData
  let selectedContent: { title?: string; content: string } | null = null

  // const {
  //   form: crawlForm,
  //   errors: crawlErrors,
  //   enhance: crawlEnhance,
  //   message: crawlMessage,
  // } = superForm(data.crawlForm, {
  //   resetForm: true,
  // })

  const {
    form: textForm,
    errors: textErrors,
    enhance: textEnhance,
    message: textMessage,
  } = superForm(data.textForm, {
    resetForm: true,
  })

  // const {
  //   form: searchForm,
  //   errors: searchErrors,
  //   enhance: searchEnhance,
  //   message: searchMessage,
  // } = superForm(data.searchForm, {
  //   resetForm: true,
  // })
</script>

<div class="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
  <PaneGroup direction="horizontal" class="h-full">
    <ResizablePane
      defaultSize={1 / 3}
      minSize={30}
      class="border-r border-border"
    >
      <ScrollArea class="h-[calc(100vh-8rem)]">
        <div class="h-full w-full p-4">
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
                  <!-- <form method="POST" action="?/crawl" class="space-y-4">
                    <div class="space-y-2">
                      <Label for="crawl_title">Crawl Title (no spaces)</Label>
                      <Input
                        type="text"
                        id="crawl_title"
                        name="crawl_title"
                        value={form?.crawl?.data?.crawl_title ?? ""}
                        placeholder="Enter a title for your website..."
                        class="w-full"
                        pattern="\S+"
                        required
                      />
                      {#if form?.crawl?.errors?.crawl_title}
                        <p class="text-sm text-red-500" role="alert">
                          {form.crawl.errors.crawl_title}
                        </p>
                      {/if}
                    </div>
          
                    <div class="space-y-2">
                      <Label for="input_url">URL to crawl</Label>
                      <Input
                        type="url"
                        id="input_url"
                        name="input_url"
                        value={form?.crawl?.data?.input_url ?? ""}
                        placeholder="https://example.com"
                        class="w-full"
                        required
                      />
                      {#if form?.crawl?.errors?.input_url}
                        <p class="text-sm text-red-500" role="alert">
                          {form.crawl.errors.input_url}
                        </p>
                      {/if}
                    </div>
          
                    <div class="space-y-2">
                      <Label for="depth">Crawl Depth (0-3)</Label>
                      <Input
                        type="number"
                        id="depth"
                        name="depth"
                        min="0"
                        max="3"
                        value={form?.crawl?.data?.depth ?? "1"}
                        class="w-full"
                        required
                      />
                      {#if form?.crawl?.errors?.depth}
                        <p class="text-sm text-red-500" role="alert">
                          {form.crawl.errors.depth}
                        </p>
                      {/if}
                    </div>
          
                    <Button type="submit" class="w-full">Start Crawl</Button>
          
                    {#if form?.crawl?.success}
                      <div
                        class="mt-4 p-4 bg-green-100 text-green-700 rounded-md"
                        role="alert"
                      >
                        {form.crawl.success}
                      </div>
                    {/if}
          
                    {#if form?.crawl?.error}
                      <div
                        class="mt-4 p-4 bg-red-100 text-red-700 rounded-md"
                        role="alert"
                      >
                        {form.crawl.error}
                      </div>
                    {/if}
                  </form> -->
                </Card.Content>
              </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="text">
              <Card.Root>
                <Card.Header>
                  <Card.Title>Add Text</Card.Title>
                  <Card.Description>Add text content directly</Card.Description>
                </Card.Header>
                <Card.Content>
                  <form
                    method="POST"
                    action="?/text"
                    class="space-y-4"
                    use:textEnhance
                  >
                    <div class="space-y-2">
                      <Label for="textTitle">Text Title (no spaces)</Label>
                      <Input
                        type="text"
                        id="textTitle"
                        name="textTitle"
                        bind:value={$textForm.textTitle}
                        placeholder="Enter a title..."
                        class="w-full"
                        pattern="\S+"
                        required
                      />
                      {#if $textErrors?.textTitle}
                        <span class="text-red-500 text-sm"
                          >{$textErrors.textTitle}</span
                        >
                      {/if}
                    </div>

                    <div class="space-y-2">
                      <Label for="textContent">Content</Label>
                      <Textarea
                        id="textContent"
                        name="textContent"
                        bind:value={$textForm.textContent}
                        placeholder="Enter your content..."
                        class="w-full min-h-[200px]"
                        required
                      />
                      {#if $textErrors?.textContent}
                        <span class="text-red-500 text-sm"
                          >{$textErrors.textContent}</span
                        >
                      {/if}
                    </div>

                    <Button type="submit" class="w-full">Save Content</Button>

                    {#if $textMessage}
                      <div
                        class="mt-4 p-4 bg-green-100 text-green-700 rounded-md"
                      >
                        {$textMessage}
                      </div>
                    {/if}

                    {#if $textErrors}
                      <div class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {JSON.stringify($textErrors, null, 2)}
                      </div>
                    {/if}
                  </form>
                </Card.Content>
              </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="search">
              <Card.Root>
                <Card.Header>
                  <Card.Title>Search Content</Card.Title>
                  <Card.Description
                    >Search through your content</Card.Description
                  >
                </Card.Header>
                <Card.Content>
                  <!-- <form method="POST" action="?/search" class="space-y-4">
                    <div class="space-y-2">
                      <Label for="searchQuery">Search Query</Label>
                      <Input
                        type="text"
                        id="searchQuery"
                        name="searchQuery"
                        value={form?.search?.data?.searchQuery ?? ""}
                        placeholder="Enter your search query..."
                        class="w-full"
                        required
                      />
                      {#if form?.search?.errors?.searchQuery}
                        <span class="text-red-500 text-sm"
                          >{form.search.errors.searchQuery}</span
                        >
                      {/if}
                    </div>
          
                    <div class="space-y-2">
                      <Label>Tags (Optional)</Label>
                      <div class="flex flex-wrap gap-2">
                        <input type="hidden" name="selectedTags" value="" />
                      </div>
                    </div>
          
                    <Button type="submit" class="w-full">Search</Button>
          
                    {#if form?.search?.error}
                      <div class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {form.search.error}
                      </div>
                    {/if}
                  </form>
          
                  {#if form?.search_results?.length > 0}
                    <div class="mt-6 space-y-4">
                      <h3 class="text-lg font-semibold">Search Results</h3>
                      {#each form.search_results as result}
                        <div class="p-4 border rounded-md">
                          <h4 class="font-medium">{result.title}</h4>
                          <p class="mt-2 text-sm text-muted-foreground">
                            {result.content?.substring(0, 200)}...
                          </p>
                          {#if result.similarity !== undefined}
                            <p class="mt-2 text-sm text-muted-foreground">
                              Relevance: {(result.similarity * 100).toFixed(1)}%
                            </p>
                          {/if}
                        </div>
                      {/each}
                    </div>
                  {/if} -->
                </Card.Content>
              </Card.Root>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </ScrollArea>
    </ResizablePane>

    <ResizableHandle withHandle />

    <ResizablePane defaultSize={2 / 3} minSize={30} class="flex flex-col">
      <Separator />
      <div class="flex-1 overflow-hidden">
        <ParentChat />
      </div>
    </ResizablePane>
  </PaneGroup>
</div>

<!-- Add Modal for Full Content -->
{#if selectedContent}
  <dialog
    open
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="max-w-2xl max-h-[80vh] bg-white rounded-md p-4 overflow-auto">
      <h2 class="text-xl font-semibold">
        {selectedContent.title || "Content Details"}
      </h2>
      <p class="mt-4 whitespace-pre-wrap text-muted-foreground">
        {selectedContent.content}
      </p>
      <button
        class="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        on:click={() => (selectedContent = null)}
      >
        Close
      </button>
    </div>
  </dialog>
{/if}
