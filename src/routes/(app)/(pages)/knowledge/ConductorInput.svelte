<script lang="ts">
  import TipTapEditor from "$lib/components/TipTapEditor/TipTapEditor.svelte"
  import { onMount } from "svelte"

  let messages: {
    role: "user" | "assistant"
    content: string
    snippets?: any[]
  }[] = []

  let allTagIds: { id: number; title: string }[] = []

  // Fetch tags on mount
  onMount(async () => {
    try {
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      const data = await response.json()
      allTagIds = data.results
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  })

  // Function to handle sending messages
  async function handleSendMessage(
    content: string,
    exampleFormat: string,
    selectedTagIds: number[],
  ) {
    // Append user's message
    messages = [...messages, { role: "user", content }]

    try {
      const response = await fetch("/api/conductor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: content,
          tagIds: selectedTagIds,
          exampleOutput: exampleFormat || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader && decoder) {
        let assistantMessage = { role: "assistant", content: "", snippets: [] }
        messages = [...messages, assistantMessage]

        let streamComplete = false
        while (!streamComplete) {
          const result = await reader.read()
          streamComplete = result.done
          if (streamComplete) break

          const chunk = decoder.decode(result.value)
          assistantMessage.content += chunk

          // Update messages to trigger reactivity
          messages = [...messages]
        }
      } else {
        console.error("Reader or decoder is unavailable")
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
    }
  }
</script>

<div class="flex flex-col h-full">
  <!-- Messages Container -->
  <!-- <MessagesContainer {messages} /> -->

  <!-- TipTap Editor -->
  <TipTapEditor onSendMessage={handleSendMessage} {allTagIds} />
</div>
