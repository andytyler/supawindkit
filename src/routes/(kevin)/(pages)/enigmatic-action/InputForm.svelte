<script lang="ts">
	export let start_url = "https://lu.ma";
	export let goal = "Find an AI event this week, preferably friday.";
	export let loading = false;

	export let handleExecute: (event: Event) => void;
	export let handleStop: () => void;
</script>

<div class="flex flex-col h-full justify-end p-4">
	<form on:submit|preventDefault={handleExecute} class="">
		<input
			name="site"
			bind:value={start_url}
			class="w-full pl-2 py-1 text-sm border-b border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring" />
		<textarea
			name="goal"
			bind:value={goal}
			class="w-full pl-2 py-1 text-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring resize-none h-32" />
		<button type="submit" disabled={loading} class="btn btn-primary w-full">
			{loading ? "Processing..." : "Start Research"}
		</button>
		<button type="button" on:click={handleStop} class="btn btn-secondary w-full mt-2"> Stop Process </button>
	</form>
</div>
