<script lang="ts">
  import { afterUpdate } from "svelte"

  let messages: { role: "user" | "assistant"; content: string }[] = []
  let userInput = ""
  let loading = false
  let chatContainer: HTMLElement

  function scrollToBottom(node: HTMLElement) {
    const scroll = () => node.scrollTo(0, node.scrollHeight)
    return {
      update: scroll,
    }
  }

  afterUpdate(() => {
    if (chatContainer) {
      chatContainer.scrollTo(0, chatContainer.scrollHeight)
    }
  })

  async function handleSubmit() {
    loading = true
    messages = [...messages, { role: "user", content: userInput }]
    const systemPrompt = "You are a helpful assistant." // Customize as needed

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput, systemPrompt }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = { role: "assistant" as const, content: "" }
      messages = [...messages, assistantMessage]

      while (true) {
        const result = await reader?.read()
        if (!result || result.done) break
        const { value } = result
        const chunk = decoder.decode(value)
        assistantMessage.content += chunk
        messages = [...messages]
      }

      userInput = ""
    } catch (error) {
      console.error("Error:", error)
      messages = [
        ...messages,
        {
          role: "assistant",
          content: "💀 An error occurred while processing your request.",
        },
      ]
    } finally {
      loading = false
    }
  }
</script>

<div class="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
  <div
    class="max-w-6xl w-full h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] mx-auto bg-white rounded-lg shadow-md flex flex-col"
  >
    <h1 class="text-2xl font-bold m-6">SupaChat</h1>

    <div
      bind:this={chatContainer}
      use:scrollToBottom
      class="flex-grow mx-6 mb-6 overflow-y-auto border border-gray-300 rounded-md p-4"
    >
      {#each messages as message}
        <div
          class={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {#if message.role === "assistant"}
            <div
              class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
          {/if}
          <div
            class={`max-w-[70%] p-2 rounded-lg ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
          >
            {message.content}
          </div>
          {#if message.role === "user"}
            <div
              class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-white"
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

    <form on:submit|preventDefault={handleSubmit} class="flex gap-2 mx-6 mb-6">
      <input
        type="text"
        bind:value={userInput}
        placeholder="Type your message..."
        class="input input-bordered w-full"
      />
      <button type="submit" disabled={loading} class="btn btn-primary">
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  </div>
</div>
