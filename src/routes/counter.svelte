<script>
	import counter from './lib/counter';
</script>

<button on:click={() => counter.decrement()}>-</button>
<span>{$counter}</span>
<button on:click={() => counter.increment()}>+</button>
