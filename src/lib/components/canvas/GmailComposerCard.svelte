<script lang="ts">
  import { Button } from "$components/ui/button"
  import { Input } from "$components/ui/input"
  import { Separator } from "$components/ui/separator"
  import { Send, Trash2 } from "lucide-svelte"

  export let subject: string = ""
  export let to: string = ""
  export let content: string = ""
</script>

<div class="w-full bg-card">
  <div class="p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span class="text-sm w-12">To:</span>
      <Input
        type="text"
        bind:value={to}
        class="flex-1 h-8 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 px-0"
      />
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm w-12">Subject:</span>
      <Input
        type="text"
        bind:value={subject}
        class="flex-1 h-8 bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 px-0"
      />
    </div>
    <textarea
      bind:value={content}
      class="w-full h-[200px] bg-transparent border-0 focus:outline-none resize-none"
      placeholder="Compose email..."
    />
  </div>
  <Separator />
  <div class="p-4 flex items-center gap-2">
    <Button class="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
      >Send
      <Send size={16} />
    </Button>
    <Button variant="outline">
      <Trash2 size={16} />
    </Button>
  </div>
</div>
