import { writable, get } from 'svelte/store';
import { noop } from 'svelte/internal';
import { browser } from '$app/environment';

/**
 * @template X
 * @typedef {import('svelte/store').Writable<X>} Writable<X>
 */

/**
 * @template T
 * @implements {Writable<T>}
 */
export default class Store {
	/**
	 * @protected
	 * @type {Writable<T>} */
	store;

	/**
	 * @typedef {Object} Options
	 * @property {"null" | "localStorage" | "sessionStorage"} storage
	 * @property {string} [key]
	 * @property {boolean} [load] - Indicates whether value in storage has precedence over value value
	 */

	/** @type {null | localStorage | sessionStorage} */
	storage;

	/** @type {Options["key"]} */
	key;

	/**
	 * @public
	 */
	subscribe;

	/**
	 * @public
	 * @param {T} value
	 */
	set(value) {
		this.storage?.setItem(this.key || '', JSON.stringify({ value }));
		this.store.set(value);
	}

	/**typeof window !== 'undefined'
	 * @public
	 * @param {import('svelte/store').Updater<T>} updater */
	update(updater) {
		const value = updater(get(this.store));
		this.set(value);
	}

	/**
	 * @constructor
	 * @param {T} [value]
	 * @param {Options} [options]
	 * @param {import('svelte/store').StartStopNotifier<any>} start
	 */
	constructor(value, options = { storage: 'null', key: '', load: false }, start = noop) {
		this.storage = browser
			? options.storage === 'localStorage'
				? localStorage
				: options.storage === 'sessionStorage'
				? sessionStorage
				: null
			: null;
		this.key = options.key || '';

		if (this.storage) {
			if (this.storage.getItem(options.key || '')) {
				if (options.load) {
					value = JSON.parse(this.storage.getItem(options.key || '') || '{}').value;
				}
			}
			this.storage.setItem(options.key || '', JSON.stringify({ value }));
		}

		this.store = writable(value, start);
		this.subscribe = this.store.subscribe;
	}

	/** @returns {T} */
	current() {
		return get(this.store);
	}
}
