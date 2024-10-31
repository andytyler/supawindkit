<script lang="ts">
  import { selectedTagIds } from "$stores/tags"
  import { onMount } from "svelte"
  import MessagesContainer from "./MessagesContainer.svelte"
  import TipTapEditor from "./TipTapEditor.svelte"

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
  async function handleSendMessage(content: string, exampleOutput: string) {
    // Append user's message
    messages = [...messages, { role: "user", content }]

    // Prepare the system prompt
    const systemPrompt = exampleOutput
      ? `You are a helpful assistant. When formatting your response, use this example as a template for the structure:\n\n${exampleOutput}\n\nMaintain a similar format while providing relevant content.`
      : "You are a helpful assistant. You have access to snippets, for context, in the user input. Use them to answer the user's question, briefly."

    // Send the message to the server and handle streaming
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: content,
          systemPrompt,
          tagIds: selectedTagIds,
          exampleOutput: exampleOutput || null,
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
  <MessagesContainer {messages} />

  <!-- TipTap Editor -->
  <TipTapEditor onSendMessage={handleSendMessage} {allTagIds} />
</div>
