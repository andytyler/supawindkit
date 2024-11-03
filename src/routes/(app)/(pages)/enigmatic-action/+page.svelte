<script lang="ts">
	import { chatStore } from "$lib/stores/chatStore";
	import { displayUserInputPrompt } from "$lib/stores/userInputStore";
	import { onDestroy, onMount } from "svelte";
	import ChatsStream from "./ChatsStream.svelte";
	import InputForm from "./InputForm.svelte";
	import Console from "./PreviewPane.svelte";
	import UserInputModal from "./UserInputModal.svelte";

	let start_url = "https://lu.ma";
	let goal = "Find an AI event this week.";
	let loading = false;
	let eventSource: EventSource | null = null;

	function connectEventSource() {
		if (eventSource) {
			eventSource.close();
		}
		eventSource = new EventSource("/api/chat-stream");
		eventSource.onmessage = (event) => {
			const newChat = JSON.parse(event.data);
			const run_id = newChat.run_id;

			chatStore.update((store) => {
				const chats = store[run_id] || [];
				return { ...store, [run_id]: [...chats, newChat] };
			});

			// Check for user input requests
			if (newChat.type === "request_user_input") {
				displayUserInputPrompt(newChat.message, newChat.run_id);
			}
		};
		eventSource.onerror = (error) => {
			console.error("SSE error:", error);
			if (eventSource) {
				eventSource.close();
				eventSource = null;
			}
			// Attempt to reconnect after a delay
			setTimeout(connectEventSource, 2000);
		};
	}

	onMount(() => {
		connectEventSource();
	});

	onDestroy(() => {
		if (eventSource) {
			eventSource.close();
		}
	});

	async function handleExecute() {
		loading = true;
		chatStore.set([]); // Reset chats
		connectEventSource(); // Reconnect to ensure a fresh connection

		try {
			const response = await fetch("/api/execute-enigmatic", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ site: start_url, goal }),
			});
			if (!response.ok) {
				throw new Error("Failed to start execution");
			}
		} catch (error) {
			console.error("Error starting execution:", error);
		} finally {
			loading = false;
		}
	}

	async function handleStop() {
		try {
			const response = await fetch("/api/execute-enigmatic/stop", {
				method: "POST",
			});
			if (response.ok) {
				console.log("Process stopped successfully");
				// Optionally, update UI or state to reflect the stopped process
			} else {
				console.error("Failed to stop process");
			}
		} catch (error) {
			console.error("Error stopping process:", error);
		}
	}
</script>

<main class="flex flex-col bg-background min-h-screen max-h-screen fixed inset-0">
	<div class="w-full border-b p-4 bg-muted">
		<h1 class="text-xl font-semibold">Playground Console</h1>
	</div>

	<div class="flex flex-row w-full" style="max-height: calc(100vh - 60px); height: calc(100vh - 60px)">
		<div class="flex flex-col w-1/2 h-full border-r border-border">
			<UserInputModal />
			<InputForm {handleExecute} {handleStop} bind:start_url bind:goal bind:loading />
		</div>

		<ChatsStream />

		<Console />
	</div>
</main>
