<script lang="ts">
  import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "$lib/components/ui/accordion"
  import { marked } from "marked"

  export let snippet: {
    content: string
    source: string
    similarity?: number
  }
</script>

<AccordionItem
  value={snippet.source}
  class="mt-2 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-2"
>
  <AccordionTrigger class="px-4 py-2 hover:no-underline">
    <div class="flex justify-between w-full">
      <span class="text-sm text-yellow-800 font-medium">
        {snippet.source || "Unknown Source"}
      </span>
      {#if snippet.similarity}
        <span class="text-xs text-gray-500">
          {snippet.similarity.toFixed(2)}
        </span>
      {/if}
    </div>
  </AccordionTrigger>
  <AccordionContent class="px-4">
    <div class="text-sm text-yellow-700">
      {@html marked(snippet.content)}
    </div>
  </AccordionContent>
</AccordionItem>
