<script lang="ts">
  import Chat from "./Chat.svelte"
  import IngestCrawl from "./IngestCrawl.svelte"
  import Tags from "./Tags.svelte"
</script>

<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">
    <IngestCrawl />
    <Tags />
  </div>
  <div class="w-full md:w-1/2">
    <Chat />
  </div>
</div>
