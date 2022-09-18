import Store from '$lib';

class Counter extends Store<number> {
	increment() {
		this.update((n) => n + 1);
	}

	decrement() {
		this.update((n) => n - 1);
	}
}

export default new Counter(0);
