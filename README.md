# Svelegante

A Classy writable store for Svelte. As with any class it can be extended.

## Why?

While experimenting with Svelte I found myself oftenly extending the writable store, with the objective to keep "business logic" on a single place.

Svelegante was created as a class around the writable function, enforcing Svelte types.

## Installation

``` bash
npm install --save-dep svelegante
```

## Works just like a writable store

``` javascript
// hello_world.js

import Store from 'svelegante';

export default new Store('Hello World');
```

## It can be extended

To extend it you can simply use `this.update` and `this.set` on your customized methods, with the same syntax of the respective writable methods.

To retrieve the current value from within a customized method you can use `this.current`. 

All this three methods are available to instances of the store, including this.current which is not reactive, it serves for the case where there is need to retrieve a value asynchronously.

``` javascript
// counter.js

import Store from 'svelegante';

class Counter extends Store<number> {
	increment() {
		this.update((n) => n + 1);
	}

	decrement() {
		this.update((n) => n - 1);
	}
}

export default new Counter(0);
```
