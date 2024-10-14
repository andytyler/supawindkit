<script lang="ts">
  import { marked } from "marked"

  export let snippet: {
    content: string
    source: string
    similarity?: number
  }
</script>

<div class="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500 rounded mb-2">
  <div class="text-sm text-yellow-600">
    <!-- Render snippet content as Markdown -->
    {@html marked(snippet.content)}
  </div>
  <div class="flex justify-between">
    <span class="text-xs text-gray-500">
      ({snippet.source || "Unknown Source"})
    </span>
    {#if snippet.similarity}
      <span class="text-xs text-gray-500">
        {snippet.similarity.toFixed(2)}
      </span>
    {/if}
  </div>
</div>
