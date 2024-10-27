<script lang="ts">
  import { browser } from "$app/environment"
  import { Button } from "$components/ui/button"
  import { Separator } from "$components/ui/separator"
  import { Editor } from "@tiptap/core"
  import type { SuggestionKeyDownProps } from "@tiptap/suggestion"
  import { marked } from "marked"
  import { afterUpdate, onDestroy, onMount } from "svelte"
  import TurndownService from "turndown"
  import Snippet from "./Snippet.svelte"
  import Tags from "./Tags.svelte"

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
    // Convert HTML to Markdown
    const markdownContent = turndownService.turndown(userInput)
    messages = [...messages, { role: "user", content: markdownContent }]
    const systemPrompt =
      "You are a helpful assistant. You have access to snippets, for context, in the user input. Use them to answer the user's question, briefly."

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: markdownContent, // Send markdown instead of HTML
          systemPrompt,
          tagIds: selectedTagIds,
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

      while (true) {
        const result = await reader?.read()
        if (!result || result.done) break
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
                      popup.style.left = `${window.scrollX + clientRect().left}px`
                      popup.style.top = `${window.scrollY + clientRect().bottom}px`
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
</script>

<div class="min-h-full h-full bg-card flex flex-col">
  <div
    bind:this={chatContainer}
    use:scrollToBottom
    class="flex-1 mx-6 overflow-y-auto"
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

  <div class="sticky bottom-0 bg-card">
    <Separator class="mb-2" />
    <div class="p-4">
      <div class="flex mx-6">
        <Tags on:tagsSelected={handleTagsSelected} />
      </div>

      <form
        on:submit|preventDefault={sendChatRequest}
        class="flex flex-col gap-2"
      >
        <div bind:this={editorElement} />
        <Button
          class="w-fit self-end"
          type="submit"
          disabled={loading}
          size="sm"
          variant="default"
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  </div>
</div>

<style>
  :global(.tiptap span.mention) {
    @apply bg-primary text-primary-foreground px-1 rounded font-bold inline-flex items-center gap-1 border border-primary transition-colors;
  }
  :global(.tiptap) {
    @apply resize-y prose max-w-none w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] max-h-[300px] overflow-y-auto;
  }
</style>
