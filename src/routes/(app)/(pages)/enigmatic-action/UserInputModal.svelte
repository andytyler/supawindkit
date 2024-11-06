<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import {
    hideUserInputPrompt,
    userInputStore,
  } from "$lib/stores/userInputStore"

  let userInput = ""

  export let run_id: string

  async function handleSubmit() {
    if (run_id) {
      // Send user input to the server
      const response = await fetch("/api/execute-enigmatic/user-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ run_id, input: userInput }),
      })

      if (response.ok) {
        console.log("Input submitted successfully")
      } else {
        console.error("Failed to submit input")
      }
    }

    hideUserInputPrompt(run_id)
    userInput = ""
  }
</script>

{#if $userInputStore[run_id]?.isWaiting}
  <div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Input Required</h3>
      <p class="text-sm text-muted-foreground">{$userInputStore[run_id]?.prompt}</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <Input
        type="text"
        bind:value={userInput}
        placeholder="Enter your response"
        class="w-full"
      />
      <Button type="submit" class="w-full">Submit</Button>
    </form>
  </div>
{/if}
