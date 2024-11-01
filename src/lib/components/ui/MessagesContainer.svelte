<script lang="ts">
  import Snippet from "$lib/components/ui/Snippet.svelte"
  import { marked } from "marked"

  export let messages: {
    role: "user" | "assistant"
    content: string
    snippets?: any[]
  }[]

  let chatContainer: HTMLElement

  // Auto-scroll to bottom when messages update
  $: {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }
</script>

<div bind:this={chatContainer} class="flex-1 mx-6 overflow-y-auto pb-20">
  {#each messages as message}
    <div
      class={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {#if message.role === "assistant"}
        <div
          class="w-8 h-8 rounded-full bg-card flex items-center justify-center mr-2"
        >
          <!-- Assistant Avatar -->
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
        class={`max-w-[70%] p-2 rounded-lg ${
          message.role === "user" ? "bg-primary/50" : "bg-secondary"
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
          class="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2"
        >
          <!-- User Avatar -->
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
