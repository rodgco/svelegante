import Store from './index';
import { describe, it, expect } from 'vitest';
import { noop } from 'svelte/internal';
import { derived, get } from 'svelte/store';

describe('store', () => {
	it('creates a store', () => {
		const count = new Store(0);
		/** @type {number[]} */
		const values = [];

		const unsubscribe = count.subscribe((value) => {
			values.push(value);
		});

		unsubscribe();

		expect(values).toEqual([0]);
	});

	it('creates writable a store', () => {
		const count = new Store(0);
		/** @type {number[]} */
		const values = [];

		const unsubscribe = count.subscribe((value) => {
			values.push(value);
		});

		count.set(1);
		count.update((n) => n + 1);

		unsubscribe();

		count.set(3);
		count.update((n) => n + 1);

		expect(values).toEqual([0, 1, 2]);
	});

	it('is extensible', () => {
		/** @extends {Store<number>} */
		class MyStore extends Store {
			increment() {
				this.update((curr) => ++curr);
			}
		}

		const count = new MyStore(0);
		/** @type {number[]} */
		const values = [];

		const unsubscribe = count.subscribe((value) => {
			values.push(value);
		});

		count.increment();

		unsubscribe();

		expect(values).toEqual([0, 1]);
	});

	it('creates an undefined writable store', () => {
		const store = new Store();

		/** @type{unknown[]} */
		const values = [];

		const unsubscribe = store.subscribe((value) => {
			values.push(value);
		});

		unsubscribe();

		expect(values).toEqual([undefined]);
	});

	it('calls provided subscribe handler', () => {
		let called = 0;

		const store = new Store(0, undefined, () => {
			called += 1;
			return () => (called -= 1);
		});

		const unsubscribe1 = store.subscribe(noop);
		expect(called).toBe(1);

		const unsubscribe2 = store.subscribe(noop);
		expect(called).toBe(1);

		unsubscribe1();
		expect(called).toBe(1);

		unsubscribe2();
		expect(called).toBe(0);
	});

	it('does not assume immutable data', () => {
		const obj = {};
		let called = 0;

		const store = new Store(obj);

		store.subscribe(() => {
			called += 1;
		});

		store.set(obj);
		expect(called).toBe(2);

		store.update((obj) => obj);
		expect(called).toBe(3);
	});

	it('only calls subscriber once initially, including on resubscriptions', () => {
		let num = 0;
		const store = new Store(num, (set) => set((num += 1)));

		let count1 = 0;
		let count2 = 0;

		store.subscribe(() => (count1 += 1))();
		expect(count1).toBe(1);

		const unsubscribe = store.subscribe(() => (count2 += 1));
		expect(count2).toBe(1);

		unsubscribe();
	});

	describe('it works with derived', () => {
		it('maps a single store', () => {
			const a = new Store(1);
			const b = derived(a, (n) => n * 2);

			/** @type {number[]} */
			const values = [];

			const unsubscribe = b.subscribe((value) => {
				values.push(value);
			});

			a.set(2);
			expect(values).toEqual([2, 4]);

			unsubscribe();

			a.set(3);
			expect(values).toEqual([2, 4]);
		});

		it('maps multiple stores', () => {
			const a = new Store(2);
			const b = new Store(3);
			const c = derived([a, b], ([a, b]) => a * b);

			/** @type {number[]} */
			const values = [];

			const unsubscribe = c.subscribe((value) => {
				values.push(value);
			});

			a.set(4);
			b.set(5);
			expect(values).toEqual([6, 12, 20]);

			unsubscribe();

			a.set(6);
			expect(values).toEqual([6, 12, 20]);
		});
	});

	describe('it works with get', () => {
		it('gets the current value of a store', () => {
			const store = new Store(42, noop);
			expect(get(store)).toEqual(42);
		});
	});
});
