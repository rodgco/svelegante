<script lang="ts">
	import store from '$lib/hello_world';
	import counter from '$lib/counter';
	import Header from './header.svelte';
	import Counter from './counter.svelte'

	let value = $store;

	let asyncCounter = counter.current();
</script>

<Header />
<h2 aria-live="polite" role="log">{$store}, Rodrigo.</h2>
<form on:submit|preventDefault={() => store.set(value)}>
	<input type="text" bind:value />
</form>

<Counter />

<p><button on:click={() => asyncCounter = counter.current()}>Update</button>
 { asyncCounter }</p>
