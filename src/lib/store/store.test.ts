import Store from './index';
import * as assert from 'assert';
import { noop } from 'svelte/internal';
import { derived, get } from 'svelte/store';

describe('store', () => {
	it('creates a store', () => {
		const count = new Store(0);
		const values: number[] = [];

		const unsubscribe = count.subscribe((value) => {
			values.push(value);
		});

		unsubscribe();

		assert.deepEqual(values, [0]);
	});

	it('creates writable a store', () => {
		const count = new Store(0);
		const values: number[] = [];

		const unsubscribe = count.subscribe((value) => {
			values.push(value);
		});

		count.set(1);
		count.update((n) => n + 1);

		unsubscribe();

		count.set(3);
		count.update((n) => n + 1);

		assert.deepEqual(values, [0, 1, 2]);
	});

	it('is extensible', () => {
		class MyStore extends Store<number> {
			increment() {
				this.update((curr: number) => ++curr);
			}
		}

		const count = new MyStore(0);
		const values: number[] = [];

		const unsubscribe = count.subscribe((value) => {
			values.push(value);
		});

		count.increment();

		unsubscribe();

		assert.deepEqual(values, [0, 1]);
	});

	it('creates an undefined writable store', () => {
		const store = new Store();
		const values: unknown[] = [];

		const unsubscribe = store.subscribe((value) => {
			values.push(value);
		});

		unsubscribe();

		assert.deepEqual(values, [undefined]);
	});

	it('calls provided subscribe handler', () => {
		let called = 0;

		const store = new Store(0, () => {
			called += 1;
			return () => (called -= 1);
		});

		const unsubscribe1 = store.subscribe(noop);
		assert.equal(called, 1);

		const unsubscribe2 = store.subscribe(noop);
		assert.equal(called, 1);

		unsubscribe1();
		assert.equal(called, 1);

		unsubscribe2();
		assert.equal(called, 0);
	});

	it('does not assume immutable data', () => {
		const obj = {};
		let called = 0;

		const store = new Store(obj);

		store.subscribe(() => {
			called += 1;
		});

		store.set(obj);
		assert.equal(called, 2);

		store.update((obj) => obj);
		assert.equal(called, 3);
	});

	it('only calls subscriber once initially, including on resubscriptions', () => {
		let num = 0;
		const store = new Store(num, (set) => set((num += 1)));

		let count1 = 0;
		let count2 = 0;

		store.subscribe(() => (count1 += 1))();
		assert.equal(count1, 1);

		const unsubscribe = store.subscribe(() => (count2 += 1));
		assert.equal(count2, 1);

		unsubscribe();
	});

	describe('it works with derived', () => {
		it('maps a single store', () => {
			const a = new Store(1);
			const b = derived(a, (n) => n * 2);

			const values: number[] = [];

			const unsubscribe = b.subscribe((value) => {
				values.push(value);
			});

			a.set(2);
			assert.deepEqual(values, [2, 4]);

			unsubscribe();

			a.set(3);
			assert.deepEqual(values, [2, 4]);
		});

		it('maps multiple stores', () => {
			const a = new Store(2);
			const b = new Store(3);
			const c = derived([a, b], ([a, b]) => a * b);

			const values: number[] = [];

			const unsubscribe = c.subscribe((value) => {
				values.push(value);
			});

			a.set(4);
			b.set(5);
			assert.deepEqual(values, [6, 12, 20]);

			unsubscribe();

			a.set(6);
			assert.deepEqual(values, [6, 12, 20]);
		});
	});

	describe('it works with get', () => {
		it('gets the current value of a store', () => {
			const store = new Store(42, noop);
			assert.equal(get(store), 42);
		});
	});
});
