

<script lang="ts">
	// import { accounts, mails } from "./data.js";
	import Mail from "./Mail.svelte";

	export let data;
</script>

<Mail
	accounts={null}
	mails={null}
	defaultLayout={data.layout}
	defaultCollapsed={data.collapsed}
	navCollapsedSize={4}
/>