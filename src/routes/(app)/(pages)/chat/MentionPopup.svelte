<script lang="ts">
  import { Command, CommandItem, CommandList } from "$lib/components/ui/command"
  import { selectedTagIds } from "$stores/tags"
  import { X } from "lucide-svelte"
  import { onDestroy, onMount } from "svelte"

  type SuggestionProps = {
    items: Array<{ id: number; title: string }>
    command: (item: { id: string; label: string }) => void
    clientRect: () => DOMRect | null
    range: any
  }

  export let items: SuggestionProps["items"] = []
  export let command: SuggestionProps["command"]
  export let clientRect: SuggestionProps["clientRect"]
  export let range: SuggestionProps["range"]

  let popup: HTMLElement
  let selectedIndex = 0

  // Add observer to watch for @ symbol removal
  let observer: MutationObserver

  onMount(() => {
    // Create mutation observer to watch for @ symbol removal
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "characterData" ||
          mutation.type === "childList"
        ) {
          const editorContent =
            document.querySelector(".tiptap")?.textContent || ""
          const currentPosition = range?.from || 0

          // Check if @ symbol still exists at the expected position
          const textBeforeCursor = editorContent.slice(0, currentPosition)
          if (!textBeforeCursor.endsWith("@")) {
            destroyPopup()
          }
        }
      })
    })

    // Start observing the editor
    const editorElement = document.querySelector(".tiptap")
    if (editorElement) {
      observer.observe(editorElement, {
        childList: true,
        characterData: true,
        subtree: true,
      })
    }
  })

  onDestroy(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  function destroyPopup() {
    if (popup) {
      popup.remove()
    }
  }

  function handleSelect(item: { id: number; title: string }) {
    selectedTagIds.update((current) =>
      current.includes(item.id) ? current : [...current, item.id],
    )
    command({
      id: item.id.toString(),
      label: item.title,
    })
    destroyPopup()
  }

  // Export this function to be called from parent
  export function handleKeyDown(event: KeyboardEvent) {
    if (!items?.length) return false

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault()
        selectedIndex = (selectedIndex - 1 + items.length) % items.length
        return true

      case "ArrowDown":
        event.preventDefault()
        selectedIndex = (selectedIndex + 1) % items.length
        return true

      case "Enter":
        event.preventDefault()
        const selectedItem = items[selectedIndex]
        if (selectedItem) {
          handleSelect(selectedItem)
          return true
        }
        return false

      case "Escape":
        event.preventDefault()
        if (range?.parent) {
          range.parent.remove()
        }
        return true

      case "Tab":
        event.preventDefault()
        return false

      default:
        return false
    }
  }

  // Improved positioning logic
  $: if (popup && clientRect) {
    const rect = clientRect()
    if (rect) {
      const popupRect = popup.getBoundingClientRect()
      const top = rect.bottom + window.scrollY
      const left = rect.left + window.scrollX

      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Add padding to prevent touching screen edges
      const PADDING = 8

      popup.style.position = "absolute"
      popup.style.left = `${Math.min(
        Math.max(PADDING, left),
        viewportWidth - popupRect.width - PADDING,
      )}px`
      popup.style.top =
        top + popupRect.height > viewportHeight - PADDING
          ? `${rect.top - popupRect.height + window.scrollY}px`
          : `${top}px`
    }
  }
</script>

<div
  bind:this={popup}
  role="menu"
  tabindex="0"
  class="absolute z-[9999] min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
  on:keydown={handleKeyDown}
>
  <div class="flex items-center justify-between border-b px-2 py-1">
    <span class="text-sm font-medium">Tags</span>
    <button
      on:click={destroyPopup}
      class="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </button>
  </div>
  <Command class="w-full">
    <CommandList>
      {#if items.length === 0}
        <div class="p-2 text-sm text-muted-foreground">No tags found</div>
      {:else}
        {#each items as item, index}
          <CommandItem>
            <button
              on:click={() => handleSelect(item)}
              class="flex w-full items-center gap-2 px-2 py-1.5 text-sm {index ===
              selectedIndex
                ? 'bg-accent text-accent-foreground'
                : ''} hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <span class="h-2 w-2 rounded-full bg-primary" />
              <span>{item.title}</span>
            </button>
          </CommandItem>
        {/each}
      {/if}
    </CommandList>
  </Command>
</div>

<style>
  :global(.cmd-list) {
    @apply max-h-[300px] overflow-y-auto overflow-x-hidden;
  }
</style>
