<script>
	import helloWorld from './lib/hello_world';
	import counter from './lib/counter';

	import Header from './header.svelte';
	import Counter from './counter.svelte';

	let value = $helloWorld;

	let asyncCounter = $counter;
</script>

<Header />
<h2 aria-live="polite" role="log">{$helloWorld}</h2>
<form on:submit|preventDefault={() => helloWorld.set(value)}>
	<input type="text" bind:value />
</form>

<h2>Counter</h2>
<Counter />

<p>
	<button on:click={() => (asyncCounter = $counter)}>Async Update</button>
	{asyncCounter}
</p>
