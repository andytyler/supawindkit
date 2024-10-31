<script lang="ts">
  import { browser } from "$app/environment"
  import { Button } from "$components/ui/button"
  import { Separator } from "$components/ui/separator"
  import { selectedTagIds } from "$stores/tags"
  import { Editor } from "@tiptap/core"
  import { ChevronRight } from "lucide-svelte"
  import { marked } from "marked"
  import { afterUpdate, onDestroy, onMount } from "svelte"
  import type { Unsubscriber } from "svelte/store"
  import TurndownService from "turndown"
  import MentionPopup from "./MentionPopup.svelte"
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
  let previousSelectedTagIds: number[] = []

  /**
   * Stores the unsubscribe function for the store subscription.
   */
  let unsubscribeStore: Unsubscriber

  /**
   * Subscribes to changes in the selectedTagIds store to synchronize mentions.
   */
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

      // Add proper typing for the mention suggestion
      type MentionSuggestion = {
        items: Array<{ id: number; title: string }>
        command: (item: { id: string; label: string }) => void
        clientRect: () => DOMRect | null
        range: any
      }

      editor = new Editor({
        element: editorElement,
        extensions: [
          StarterKit,
          Mention.configure({
            HTMLAttributes: {
              class: "mention",
              "data-type": "mention",
            },
            suggestion: {
              char: "@",
              allowSpaces: false,
              items: ({ query }) => {
                return allTagIds
                  .filter((tag) =>
                    tag.title.toLowerCase().includes(query.toLowerCase()),
                  )
                  .slice(0, 5)
              },
              render: () => {
                let component: any
                let popup: MentionPopup

                return {
                  onStart: (props) => {
                    const existingPopups =
                      document.querySelectorAll('[role="menu"]')
                    existingPopups.forEach((popup) => {
                      popup.remove()
                    })

                    component = new MentionPopup({
                      target: document.body,
                      props: {
                        items: props.items,
                        command: ({ id, label }) => {
                          props.command({ id, label })
                          const numId = parseInt(id)
                          selectedTagIds.update((current) =>
                            current.includes(numId)
                              ? current
                              : [...current, numId],
                          )
                          component.$destroy()
                        },
                        clientRect: props.clientRect,
                        range: props.range,
                      },
                    })
                    popup = component
                  },
                  onUpdate: (props) => {
                    if (component) {
                      component.$set({
                        items: props.items,
                        command: ({ id, label }) => {
                          props.command({ id, label })
                          const numId = parseInt(id)
                          selectedTagIds.update((current) =>
                            current.includes(numId)
                              ? current
                              : [...current, numId],
                          )
                          component.$destroy()
                        },
                        clientRect: props.clientRect,
                        range: props.range,
                      })
                    }
                  },
                  onKeyDown: (props) => {
                    if (popup?.handleKeyDown) {
                      return popup.handleKeyDown(props.event)
                    }
                    return false
                  },
                  onExit: () => {
                    if (component) {
                      component.$destroy()
                    }
                  },
                }
              },
            },
          }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
          userInput = editor.getHTML()
          syncMentionsWithTags(editor)
        },
      })

      /**
       * Subscribe to selectedTagIds store changes to synchronize mentions.
       */
      unsubscribeStore = selectedTagIds.subscribe((currentSelectedTagIds) => {
        const removedTagIds = previousSelectedTagIds.filter(
          (id) => !currentSelectedTagIds.includes(id),
        )

        removedTagIds.forEach((tagId) => {
          removeMentionByTagId(tagId)
        })

        previousSelectedTagIds = [...currentSelectedTagIds]
      })
    }
  })

  onDestroy(() => {
    if (unsubscribeStore) unsubscribeStore()
    if (editor) {
      editor.destroy()
    }
  })

  afterUpdate(() => {
    if (chatContainer) {
      chatContainer.scrollTo(0, chatContainer.scrollHeight)
    }
    if (inputElement) {
      inputElement.style.height = "auto"
      inputElement.style.height = inputElement.scrollHeight + "px"
    }
  })

  /**
   * Removes all mentions in the editor associated with a specific tag ID.
   * @param tagId - The ID of the tag to remove mentions for.
   */
  function removeMentionByTagId(tagId: number) {
    if (!editor) return

    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === "mention" && node.attrs.id === tagId.toString()) {
        editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize })
      }
    })
  }

  /**
   * Sends a chat request to the server with the current user input and selected tags.
   */
  async function sendChatRequest() {
    if (!editor) return

    loading = true
    console.log("Loading started")
    const markdownContent = turndownService.turndown(userInput)

    // Show the user what context is being used
    if ($selectedTagIds.length > 0) {
      const tagNames = $selectedTagIds
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
          tagIds: $selectedTagIds,
          exampleOutput: exampleOutput || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader && decoder) {
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
        // Clear the editor content and destroy any active mention popups
        editor.commands.clearContent()

        // Force destroy any active mention popups
        const activeMentionPopups = document.querySelectorAll('[role="menu"]')
        activeMentionPopups.forEach((popup) => {
          popup.remove()
        })
      } else {
        console.error("Reader or decoder is unavailable")
        loading = false
        return
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
      console.log("Loading ended")
    }
  }

  // Add function to sync mentions with tags
  function syncMentionsWithTags(editor: Editor) {
    const doc = editor.state.doc
    const mentionIds = new Set<number>()

    doc.descendants((node) => {
      if (node.type.name === "mention") {
        mentionIds.add(parseInt(node.attrs.id))
      }
    })

    selectedTagIds.update((current) =>
      Array.from(new Set([...current.filter((id) => mentionIds.has(id))])),
    )
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
        class={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      >
        {#if message.role === "assistant"}
          <div
            class="w-8 h-8 rounded-full bg-card flex items-center justify-center mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-foreground"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
        {/if}
        <div
          class={`max-w-[70%] p-2 rounded-lg ${message.role === "user" ? "bg-primary/50" : "bg-secondary"}`}
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
            class="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-foreground"
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
            class={`transition-transform duration-200 ${showExampleInput ? "rotate-90" : ""}`}
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

          {#if $selectedTagIds.length > 0}
            <div class="mt-2 flex flex-wrap gap-2">
              {#each $selectedTagIds as tagId}
                {#if allTagIds.find((t) => t.id === tagId)}
                  <div
                    class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm font-medium border border-primary/20"
                  >
                    <span>{allTagIds.find((t) => t.id === tagId)?.title}</span>
                    <button
                      type="button"
                      class="hover:text-primary transition-colors"
                      on:click={() => {
                        selectedTagIds.update((current) =>
                          current.filter((id) => id !== tagId),
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

  /* Add some spacing between paragraphs in the editor */
  :global(.tiptap p) {
    @apply mb-1 text-sm text-foreground;
  }

  :global(.mention[data-type="mention"]) {
    @apply bg-primary text-primary-foreground px-1.5 py-0.5 
           rounded-md font-medium inline-flex items-center 
           gap-1 border border-primary/20 transition-colors
           hover:bg-primary/80 cursor-default
           focus:outline-none focus:ring-2 focus:ring-primary/50;
  }

  :global(.mention[data-type="mention"].selected) {
    @apply bg-primary/20;
  }
</style>
