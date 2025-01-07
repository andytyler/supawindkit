<script lang="ts">
  import { browser } from "$app/environment"
  import { Button } from "$components/ui/button"
  import { selectedTagIds } from "$lib/stores/tags"
  import { Editor } from "@tiptap/core"
  import DOMPurify from "dompurify"
  import { ChevronRight, Tag, X } from "lucide-svelte"
  import { marked } from "marked"
  import { onDestroy, onMount } from "svelte"
  import type { Unsubscriber } from "svelte/store"
  import MentionPopup from "./MentionPopup.svelte"

  // Props passed from parent component
  export let onSendMessage: (
    content: string,
    exampleOutput: string,
    selectedTagIds: number[],
  ) => Promise<void>
  export let allTagIds: { id: number; title: string }[] = []

  let editor: Editor | null = null
  let editorElement: HTMLDivElement
  let userInput = ""
  let loading = false
  let showExampleInput = false
  let exampleOutput = ""
  let previousSelectedTagIds: number[] = []
  let unsubscribeStore: Unsubscriber

  onMount(async () => {
    if (browser) {
      // Import TipTap modules dynamically
      const { Editor } = await import("@tiptap/core")
      const StarterKit = (await import("@tiptap/starter-kit")).default
      const Mention = (await import("@tiptap/extension-mention")).default
      const Extension = (await import("@tiptap/core")).Extension
      const Placeholder = (await import("@tiptap/extension-placeholder"))
        .default

      // Initialize the editor
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
                        clientRect: props.clientRect ?? (() => null),
                        range: props.range,
                      },
                    })
                    popup = component
                  },
                  onUpdate: (props) => {
                    if (component) {
                      component.$set({
                        items: props.items,
                        command: ({
                          id,
                          label,
                        }: {
                          id: string
                          label: string
                        }) => {
                          props.command({ id, label })
                          const numId = parseInt(id)
                          selectedTagIds.update((current) =>
                            current.includes(numId)
                              ? current
                              : [...current, numId],
                          )
                          component.$destroy()
                        },
                        clientRect: props.clientRect ?? (() => null),
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
          // Add keyboard shortcut handling
          Extension.create({
            addKeyboardShortcuts() {
              return {
                "Mod-Enter": () => {
                  sendChatRequest()
                  return true
                },
              }
            },
          }),
          // Add Placeholder extension
          Placeholder.configure({
            placeholder: "Type your message here...",
          }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
          userInput = editor.getHTML()
          syncMentionsWithTags(editor)
        },
      })

      // Subscribe to selectedTagIds store changes
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
    if (editor) editor.destroy()
  })

  function removeMentionByTagId(tagId: number) {
    if (!editor) return

    editor.view.state.doc.descendants((node, pos) => {
      if (node.type.name === "mention" && node.attrs.id === tagId.toString()) {
        editor?.commands.deleteRange({ from: pos, to: pos + node.nodeSize })
      }
    })
  }

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

  async function htmlToMarkdown(html: string): Promise<string> {
    // Sanitize the HTML first
    const cleanHtml = DOMPurify.sanitize(html)
    // Convert to markdown
    return await marked.parse(cleanHtml)
  }

  async function sendChatRequest() {
    if (!editor) return

    loading = true
    const markdownContent = await htmlToMarkdown(userInput)

    await onSendMessage(markdownContent, exampleOutput, $selectedTagIds)

    // Clear the editor content
    userInput = ""
    editor.commands.clearContent()

    loading = false
  }
</script>

<div class="sticky bottom-0 bg-card border rounded-lg border-border">
  <!-- <Separator class="mb-2" /> -->
  <div class="p-2 space-y-4">
    <form on:submit|preventDefault={sendChatRequest} class="space-y-4">
      <!-- TipTap Editor -->
      <div class="relative">
        {#if $selectedTagIds.length > 0}
          <!-- Display selected tags if any -->
          <div class="mb-2 flex flex-wrap gap-2">
            {#each $selectedTagIds as tagId}
              {#if allTagIds.find((t) => t.id === tagId)}
                <div
                  class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-sm font-medium border border-primary/20"
                >
                  <Tag size={14} />
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
                    <X size={14} />
                  </button>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
        <div bind:this={editorElement} class="relative" />
      </div>

      <!-- Toggle for Example Input -->
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
            responses.
          </p>
        </div>
      {/if}
      <!-- Send Button -->
      <div class="flex justify-end">
        <Button type="submit" disabled={loading} size="sm" variant="default">
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
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
  :global(.tiptap .suggestion) {
    @apply bg-accent text-accent-foreground px-1.5 py-0.5 
           rounded-md font-medium inline-flex items-center 
           gap-1 border border-accent/20 transition-colors
           hover:bg-accent/80 cursor-default
           focus:outline-none focus:ring-2 focus:ring-accent/50;
  }

  :global(.mention[data-type="mention"].selected) {
    @apply bg-primary/20;
  }
</style>
