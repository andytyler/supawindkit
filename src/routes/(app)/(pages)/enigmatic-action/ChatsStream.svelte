<script lang="ts">
	import { Sheet, SheetContent, SheetTrigger } from "$lib/components/ui/sheet";
	import { chatStore } from "$lib/stores/chatStore";
	import type { EventType } from "$lib/types";

	// Make chatRows reactive by declaring it as a derived value
	$: chatRows = (() => {
		const rows: EventType[][] = [];
		let currentRow: EventType[] = [];
		let currentRowId: string | null = null;

		for (const chat of $chatStore) {
			if (currentRowId === null || chat.run_id !== currentRowId) {
				if (currentRow.length > 0) {
					rows.push(currentRow);
				}
				currentRow = [];
				currentRowId = chat.run_id;
			}
			currentRow.push(chat);
		}
		if (currentRow.length > 0) {
			rows.push(currentRow);
		}
		return rows;
	})();
</script>

<div class="flex flex-col w-full h-full overflow-y-auto border-l p-2">
	{#each chatRows as row}
		<div class="flex flex-row mb-2">
			{#each row as chat}
				<Sheet>
					<SheetTrigger class="px-2 py-1 text-xs bg-primary rounded-md hover:bg-primary/90">
						{chat.type}
					</SheetTrigger>
					<SheetContent>
						<div class="mt-4">
							{#if chat.type === "screenshot" && typeof chat.message === "string"}
								<img src={chat.message} alt="Screenshot" class="w-full rounded-md" />
							{:else if chat.type === "error"}
								<p class="text-red-500 whitespace-pre-wrap">{chat.message}</p>
							{:else if ["start", "goal", "url"].includes(chat.type)}
								<p class="p-2 rounded text-center text-muted-foreground">
									{chat.message}
								</p>
							{:else}
								<pre class="font-mono whitespace-pre-wrap break-words p-2 rounded-md bg-primary/10">
									{#if typeof chat.message === "string"}
										{(() => {
											try {
												return JSON.stringify(JSON.parse(chat.message), null, 2);
											} catch {
												return chat.message;
											}
										})()}
									{:else}
										{JSON.stringify(chat.message, null, 2)}
									{/if}
								</pre>
							{/if}
						</div>
					</SheetContent>
				</Sheet>
			{/each}
		</div>
	{/each}

	{#if chatRows.length === 0}
		<p class="text-center text-muted-foreground">No chats available</p>
	{/if}
</div>
