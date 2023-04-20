# Svelegante

A Classy writable store for Svelte. As with any class it can be extended.

## Why?

While experimenting with Svelte I found myself oftenly extending the writable store, with the objective to keep "business logic" on a single place.

Svelegante was created as a class around the writable function, enforcing Svelte types.

## Installation

```bash
npm install --save-dep svelegante
```

## Works just like a writable store

```javascript
// hello_world.js

import Store from 'svelegante';

export default new Store('Hello World');

// page.svelte

<script>
    import hello from './hello_world';
</script>

<h1>{ $hello }</h1>
```

## It can be extended

To extend it you can simply use `this.update` and `this.set` on your customized methods, with the same syntax of the respective writable methods.

To retrieve the current value from within a customized method you can use `this.current`.

All this three methods are available to instances of the store, including this.current which is not reactive, it serves for the case where there is need to retrieve a value asynchronously.

```javascript
// counter.js

import Store from 'svelegante';

/** @extends {Store<number>} */
class Counter extends Store {
	increment() {
		this.update((n) => n + 1);
	}

	decrement() {
		this.update((n) => n - 1);
	}
}

export default new Counter(0);

// counter.svelte

<script>
    import counter from './counter'
</script>

<button on:click={() => counter.decrement()}>-</button>
<span>{$counter}</span>
<button on:click={() => counter.increment()}>+</button>
```

## It can be persisted

By now it can only be persisted in localStorage or sessionStorage.

To persist the store use the options parameter at the store constructor.

```javascript
// counter.js

import Store from 'svelegante';

/** @extends {Store<number>} */
class Counter extends Store {
	increment() {
		this.update((n) => n + 1);
	}

	decrement() {
		this.update((n) => n - 1);
	}
}

export default new Counter(0, { storage: 'localStorage', key: 'counter', load: true });
```

Parameters are:

- storage: a string "localStorage" or "sessionStorage".
- key: the key to indentify the entry in the storage.
- load: boolean. True will force the load of the current value in the storage into the store.
