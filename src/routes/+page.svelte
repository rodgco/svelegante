<script lang="ts">
	import store from '$lib/test/store';

	let value = $store;
</script>

<h1>Welcome to SvelteKit</h1>
<h2 aria-live="polite" role="log">{$store}, Rodrigo.</h2>
<form on:submit|preventDefault={() => store.greet(value)}>
	<input type="text" bind:value />
</form>
