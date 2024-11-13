<script lang="ts">
  import { Sheet, SheetContent, SheetTrigger } from "$lib/components/ui/sheet"
  import { chatStore } from "$lib/stores/chatStore"
  export let run_id: string

  $: chats = $chatStore[run_id] || []
</script>

<div class="flex flex-wrap gap-2 w-full h-full overflow-y-auto border-l p-2">
  {#each chats as chat}
    <Sheet>
      <SheetTrigger
        class="px-2 py-1 text-xs bg-primary rounded-md hover:bg-primary/90"
      >
        {chat.type}
      </SheetTrigger>
      <SheetContent>
        <div class="mt-4">
          {#if chat.type === "screenshot" && typeof chat.message === "string"}
            <img
              src={chat.message}
              alt="Screenshot"
              class="w-full rounded-md"
            />
          {:else if chat.type === "error"}
            <p class="text-red-500 whitespace-pre-wrap">{chat.message}</p>
          {:else if ["start", "goal", "url"].includes(chat.type)}
            <p class="p-2 rounded text-center text-muted-foreground">
              {chat.message}
            </p>
          {:else}
            <pre
              class="font-mono whitespace-pre-wrap break-words p-2 rounded-md bg-primary/10">
							{#if typeof chat.message === "string"}
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(chat.message), null, 2)
                  } catch {
                    return chat.message
                  }
                })()}
              {:else}
                {JSON.stringify(chat.message, null, 2)}
              {/if}
						</pre>
          {/if}
        </div>
      </SheetContent>
    </Sheet>
  {/each}

  {#if chats.length === 0}
    <p>No chats available</p>
  {/if}
</div>
