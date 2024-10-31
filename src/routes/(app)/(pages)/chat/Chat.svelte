<script lang="ts">
  import { browser } from "$app/environment"
  import { Button } from "$components/ui/button"
  import { Separator } from "$components/ui/separator"
  import { Editor } from "@tiptap/core"
  import type { SuggestionKeyDownProps } from "@tiptap/suggestion"
  import { ChevronRight } from "lucide-svelte"
  import { marked } from "marked"
  import { afterUpdate, onDestroy, onMount } from "svelte"
  import TurndownService from "turndown"
  import Snippet from "./Snippet.svelte"

  const turndownService = new TurndownService()

  let messages: {
    role: "user" | "assistant"
    content: string
    snippets?: any[]
  }[] = []
  let userInput = ""
  let loading = false
  let chatContainer: HTMLElement
  let inputElement: HTMLTextAreaElement
  let selectedTagIds: number[] = []
  let allTagIds: { id: number; title: string }[] = []

  let editor: Editor | null = null
  let editorElement: HTMLDivElement

  let showExampleInput = false
  let exampleOutput = ""

  function scrollToBottom(node: HTMLElement) {
    const scroll = () => node.scrollTo(0, node.scrollHeight)
    return {
      update: scroll,
    }
  }

  afterUpdate(() => {
    if (chatContainer) {
      chatContainer.scrollTo(0, chatContainer.scrollHeight)
    }
    if (inputElement) {
      inputElement.style.height = "auto"
      inputElement.style.height = inputElement.scrollHeight + "px"
    }
  })

  function handleTagsSelected(event: CustomEvent) {
    selectedTagIds = event.detail.selectedTags
  }

  async function sendChatRequest() {
    loading = true
    const markdownContent = turndownService.turndown(userInput)

    // Show the user what context is being used
    if (selectedTagIds.length > 0) {
      const tagNames = selectedTagIds
        .map((id) => allTagIds.find((t) => t.id === id)?.title)
        .filter(Boolean)
      messages = [
        ...messages,
        {
          role: "assistant",
          content: `Using context from tags: ${tagNames.join(", ")}`,
        },
      ]
    }

    messages = [...messages, { role: "user", content: markdownContent }]

    const systemPrompt = exampleOutput
      ? `You are a helpful assistant. When formatting your response, use this example as a template for the structure:\n\n${exampleOutput}\n\nMaintain a similar format while providing relevant content.`
      : "You are a helpful assistant. You have access to snippets, for context, in the user input. Use them to answer the user's question, briefly."

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: markdownContent,
          systemPrompt,
          tagIds: selectedTagIds,
          exampleOutput: exampleOutput || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage: {
        role: "assistant"
        content: string
        snippets: any[]
      } = { role: "assistant", content: "", snippets: [] }
      messages = [...messages, assistantMessage]

      let streamComplete = false
      while (!streamComplete && reader) {
        try {
          const result = await reader.read()
          streamComplete = result.done
          if (streamComplete) break

          const chunk = decoder.decode(result.value)

          // Check for the snippets marker
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

          messages = [...messages]
        } catch (error) {
          console.error("Stream reading error:", error)
          streamComplete = true
        }
      }

      userInput = ""
      // Clear the editor content
      if (editor) {
        editor.commands.setContent("")
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
    } finally {
      loading = false
    }
  }

  onMount(async () => {
    if (browser) {
      // Dynamically import Tiptap modules only on the client side
      const { Editor } = await import("@tiptap/core")
      const { default: StarterKit } = await import("@tiptap/starter-kit")
      const { default: Mention } = await import("@tiptap/extension-mention")

      // Fetch tags when component mounts
      try {
        const response = await fetch("/api/tags")
        if (!response.ok) throw new Error("Failed to fetch tags")
        const data = await response.json()
        allTagIds = data.results
      } catch (error) {
        console.error("Error fetching tags:", error)
      }

      editor = new Editor({
        element: editorElement,
        extensions: [
          StarterKit,
          Mention.configure({
            HTMLAttributes: {
              class: "mention",
            },
            suggestion: {
              char: "@",
              items: ({ query }) => {
                return allTagIds
                  .filter((tag) =>
                    tag.title.toLowerCase().startsWith(query.toLowerCase()),
                  )
                  .slice(0, 5)
              },
              render: () => {
                let popup: HTMLElement
                let selectedIndex = 0

                return {
                  onStart: (props) => {
                    popup = document.createElement("div")
                    popup.className =
                      "absolute bg-white shadow-lg rounded-lg p-2 min-w-[200px] border border-gray-200 z-50"
                    document.body.appendChild(popup)

                    const { clientRect } = props
                    if (clientRect) {
                      popup.style.position = "fixed"
                      const rect = clientRect()
                      if (rect) {
                        popup.style.left = `${window.scrollX + rect.left}px`
                        popup.style.top = `${window.scrollY + rect.bottom}px`
                      }
                    }
                  },
                  onUpdate: (props) => {
                    const items = props.items as Array<{
                      id: number
                      title: string
                    }>
                    selectedIndex = 0

                    popup.innerHTML = `
                      <div class="flex flex-col gap-1">
                        ${items
                          .map(
                            (item, index) => `
                          <button 
                            class="p-2 hover:bg-gray-100 rounded text-left flex items-center gap-2 w-full ${
                              index === selectedIndex ? "bg-gray-100" : ""
                            }"
                            data-id="${item.id}"
                            data-index="${index}"
                          >
                            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                            ${item.title}
                          </button>
                        `,
                          )
                          .join("")}
                      </div>
                    `

                    // Add click handlers
                    popup.querySelectorAll("button").forEach((button) => {
                      button.addEventListener("click", () => {
                        const id = button.getAttribute("data-id")
                        const item = items.find((i) => i.id.toString() === id)
                        if (item) {
                          // Add the selected tag ID to selectedTagIds if not already present
                          if (!selectedTagIds.includes(item.id)) {
                            selectedTagIds = [...selectedTagIds, item.id]
                          }
                          props.command({
                            id: item.id.toString(),
                            label: item.title,
                          })
                        }
                      })
                    })
                  },
                  onKeyDown: (props: SuggestionKeyDownProps) => {
                    const items = props.items as Array<{
                      id: number
                      title: string
                    }>

                    // Return early if no items
                    if (!items?.length) return false

                    const event = props.event as KeyboardEvent

                    // Handle keyboard navigation
                    switch (event.key) {
                      case "ArrowUp":
                        event.preventDefault()
                        selectedIndex =
                          (selectedIndex - 1 + items.length) % items.length
                        updateSelection()
                        return true

                      case "ArrowDown":
                        event.preventDefault()
                        selectedIndex = (selectedIndex + 1) % items.length
                        updateSelection()
                        return true

                      case "Enter":
                        event.preventDefault()
                        const selectedItem = items[selectedIndex]
                        if (selectedItem) {
                          // Add the selected tag ID to selectedTagIds if not already present
                          if (!selectedTagIds.includes(selectedItem.id)) {
                            selectedTagIds = [
                              ...selectedTagIds,
                              selectedItem.id,
                            ]
                          }
                          props.command({
                            id: selectedItem.id.toString(),
                            label: selectedItem.title,
                          })
                          return true
                        }
                        return false

                      case "Escape":
                        event.preventDefault()
                        props.range.parent.remove()
                        return true

                      case "Tab":
                        // Prevent tab from moving focus
                        event.preventDefault()
                        return false

                      default:
                        return false
                    }
                  },
                  onExit: () => {
                    popup?.remove()
                  },
                }

                function updateSelection() {
                  const buttons = popup?.querySelectorAll("button")
                  buttons?.forEach((button, index) => {
                    if (index === selectedIndex) {
                      button.classList.add("bg-gray-100")
                    } else {
                      button.classList.remove("bg-gray-100")
                    }
                  })
                }
              },
            },
          }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
          userInput = editor.getHTML()
        },
      })
    }
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })

  function updateTags(tags: number[]) {
    selectedTagIds = tags
  }
</script>

<div class="min-h-full h-screen bg-card flex flex-col">
  <div
    bind:this={chatContainer}
    use:scrollToBottom
    class="flex-1 mx-6 overflow-y-auto pb-[200px]"
  >
    {#each messages as message}
      <div
        class={`mb-4 flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {#if message.role === "assistant"}
          <div
            class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
        {/if}
        <div
          class={`max-w-[70%] p-2 rounded-lg ${
            message.role === "user" ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          {@html marked(message.content)}

          {#if message.snippets && message.snippets.length > 0}
            <div class="mt-2 p-2 border-l-4 border-yellow-500 rounded">
              <h4 class="font-semibold text-yellow-700">Snippets Context:</h4>
              {#each message.snippets as snippet}
                <Snippet {snippet} />
              {/each}
            </div>
          {/if}
        </div>
        {#if message.role === "user"}
          <div
            class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="sticky bottom-0 bg-card border-t">
    <Separator class="mb-2" />
    <div class="p-4 space-y-4">
      <form on:submit|preventDefault={sendChatRequest} class="space-y-4">
        <button
          type="button"
          class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
          on:click={() => (showExampleInput = !showExampleInput)}
        >
          <ChevronRight
            size={16}
            class="transition-transform duration-200 {showExampleInput
              ? 'rotate-90'
              : ''}"
          />
          Format Response Using Example
        </button>

        {#if showExampleInput}
          <div class="rounded-md border bg-muted p-3">
            <textarea
              bind:value={exampleOutput}
              class="w-full min-h-[100px] p-2 text-sm font-mono bg-background border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Paste an example of how you want the AI response to be formatted..."
            />
            <p class="text-xs text-muted-foreground mt-2">
              The AI will use this example as a template for structuring its
              responses
            </p>
          </div>
        {/if}

        <div class="relative">
          <div bind:this={editorElement} class="relative" />

          {#if selectedTagIds.length > 0}
            <div class="mt-2 flex flex-wrap gap-2">
              {#each selectedTagIds as tagId}
                {#if allTagIds.find((t) => t.id === tagId)}
                  <div
                    class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-sm font-medium border border-primary/20"
                  >
                    <span>{allTagIds.find((t) => t.id === tagId)?.title}</span>
                    <button
                      type="button"
                      class="hover:text-primary/80 transition-colors"
                      on:click={() => {
                        selectedTagIds = selectedTagIds.filter(
                          (id) => id !== tagId,
                        )
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>

        <div class="flex justify-end">
          <Button type="submit" disabled={loading} size="sm" variant="default">
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  :global(.tiptap) {
    @apply resize-none prose max-w-none w-full 
           rounded-lg border border-input bg-background 
           px-4 py-3 text-sm ring-offset-background 
           placeholder:text-muted-foreground
           focus-visible:outline-none focus-visible:ring-2 
           focus-visible:ring-ring focus-visible:ring-offset-2 
           min-h-[120px] max-h-[300px] overflow-y-auto
           shadow-sm transition-colors;
  }

  :global(.tiptap p.is-editor-empty:first-child::before) {
    content: "Type your message here...";
    @apply text-muted-foreground float-left pointer-events-none h-0;
  }

  :global(.tiptap span.mention) {
    @apply bg-primary/10 text-primary px-1.5 py-0.5 
           rounded-md font-medium inline-flex items-center 
           gap-1 border border-primary/20 transition-colors
           hover:bg-primary/15;
  }

  /* Add some spacing between paragraphs in the editor */
  :global(.tiptap p) {
    @apply mb-1;
  }
</style>
