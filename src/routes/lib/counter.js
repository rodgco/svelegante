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
