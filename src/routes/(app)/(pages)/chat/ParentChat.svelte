<script lang="ts">
  import TipTapEditor from "$lib/components/TipTapEditor/TipTapEditor.svelte"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"

  let messages: {
    role: "user" | "assistant"
    content: string
    snippets?: any[]
  }[] = []

  let allTagIds: { id: number; title: string }[] = []
  let scrollAreaViewport: HTMLDivElement

  // Fetch tags on mount
  onMount(async () => {
    try {
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      allTagIds = data.results
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  })

  // Function to handle sending messages
  async function handleSendMessage(
    content: string,
    exampleFormat: string,
    selectedTagIds: number[],
  ) {
    // Append user's message
    messages = [...messages, { role: "user", content }]

    // Prepare the system prompt
    const systemPrompt = exampleFormat
      ? `You are a helpful assistant. When formatting your response, use this example as a template for the structure:\n\n${exampleFormat}\n\nMaintain a similar format while providing relevant content.`
      : "You are a helpful assistant. You have access to snippets, for context, in the user input. Use them to answer the user's question, briefly."

    // Send the message to the server and handle streaming
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: content,
          systemPrompt,
          tagIds: selectedTagIds,
          exampleOutput: exampleFormat || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader && decoder) {
        let assistantMessage = { role: "assistant", content: "", snippets: [] }
        messages = [...messages, assistantMessage]

        let streamComplete = false
        while (!streamComplete) {
          const result = await reader.read()
          streamComplete = result.done
          if (streamComplete) break

          const chunk = decoder.decode(result.value)
          const snippetsMarker = "### Snippets Context"
          if (chunk.includes(snippetsMarker)) {
            const [answerPart, snippetsPart] = chunk.split(snippetsMarker)
            assistantMessage.content += answerPart
            try {
              assistantMessage.snippets = JSON.parse(snippetsPart)
            } catch (e) {
              console.error("Failed to parse snippets:", e)
            }
          } else {
            assistantMessage.content += chunk
          }

          // Update messages to trigger reactivity
          messages = [...messages]
        }
      } else {
        console.error("Reader or decoder is unavailable")
      }
    } catch (error) {
      console.error("Error:", error)
      messages = [
        ...messages,
        {
          role: "assistant",
          content: "💀 An error occurred while processing your request.",
        },
      ]
    }
  }

  // Auto-scroll to bottom when messages update
  $: if (messages && scrollAreaViewport) {
    scrollAreaViewport.scrollTo({
      top: scrollAreaViewport.scrollHeight,
      behavior: "smooth",
    })
  }
</script>

<div
  class="flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
  <ScrollArea class="flex-1 pr-4">
    <div bind:this={scrollAreaViewport} class="h-full px-4">
      <div class="space-y-4 py-4">
        {#each messages as message, i (i)}
          <div
            class="group relative flex flex-col gap-2 {message.role === 'user'
              ? 'items-end'
              : 'items-start'}"
            transition:fade
          >
            <div
              class="flex max-w-[80%] flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <div class="prose prose-neutral dark:prose-invert max-w-none">
                {@html message.content}
              </div>
              {#if message.snippets?.length}
                <div class="mt-4 space-y-2">
                  <h4 class="text-sm font-medium text-muted-foreground">
                    Reference Snippets:
                  </h4>
                  {#each message.snippets as snippet}
                    <div class="rounded-md bg-muted/50 p-3 text-sm">
                      <p class="font-medium text-foreground">{snippet.title}</p>
                      <p class="mt-1 text-muted-foreground">
                        {snippet.content}
                      </p>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </ScrollArea>

  <div class="border-t bg-background p-4">
    <TipTapEditor onSendMessage={handleSendMessage} {allTagIds} />
  </div>
</div>
