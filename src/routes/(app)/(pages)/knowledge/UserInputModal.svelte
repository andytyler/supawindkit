<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import {
    hideUserInputPrompt,
    userInputStore,
  } from "$lib/stores/userInputStore"

  let userInput = ""

  export let run_id: string

  $: isWaiting = $userInputStore[run_id]?.isWaiting || false
  $: prompt = $userInputStore[run_id]?.prompt || ""

  async function handleSubmit() {
    if (!run_id || !userInput.trim()) return

    try {
      const response = await fetch("/api/execute-enigmatic/user-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ run_id, input: userInput.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit input")
      }

      if (data.success) {
        hideUserInputPrompt(run_id)
        isWaiting = false
        userInput = ""
      }
    } catch (error) {
      console.error("Failed to submit input:", error)
    }
  }
</script>

{#if isWaiting}
  <div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Input Required</h3>
      <p class="text-sm text-muted-foreground">{prompt}</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <Input
        type="text"
        bind:value={userInput}
        placeholder="Enter your response"
        class="w-full"
        autofocus
      />
      <Button type="submit" class="w-full" disabled={!userInput.trim()}>
        Submit
      </Button>
    </form>
  </div>
{/if}
