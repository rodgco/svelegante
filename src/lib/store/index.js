import { writable, get } from 'svelte/store';

/** @returns {void} */
function noop() {}

/** @type {boolean} */
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * @typedef {Object} Options
 * @property {"null" | "localStorage" | "sessionStorage" | Storage | undefined | null} storage
 * @property {string | undefined | null} key
 * @property {boolean} [load] - Indicates whether value in storage has precedence over value value
 */

/**
 * @template X
 * @typedef {import('svelte/store').Writable<X>} Writable
 */

/**
 * @template T
 * @implements {Writable<T>}
 */
export default class Store {
  /**
   * @protected
   * @type {import('svelte/store').Writable<T>} */
  store;

  /** @type {undefined | null | localStorage | sessionStorage} */
  storage;

  /** @type {Options["key"]} */
  key;

  /**
   * @public
   */
  subscribe;

	/**
	 * @constructor
	 * @param {T} [value]
	 * @param {Options} [options]
	 * @param {import('svelte/store').StartStopNotifier<T>} [start]
	 */
	constructor(value, options = {}, start = noop) {
		options = {
			storage: undefined,
			key: undefined,
			load: true,
			...options
		};
		const { storage, key, load } = options;

		if (typeof storage === 'string' && isBrowser) {
			this.storage =
				options.storage === 'localStorage'
					? localStorage
					: options.storage === 'sessionStorage'
					? sessionStorage
					: null;
		} else if (isBrowser) {
			this.storage = storage;
		}
		this.key = key;

		if (this.storage) {
			if (!this.key) {
				throw new Error('key is required when storage is set');
			}

			if (this.storage.getItem(this.key)) {
				if (load) {
					// value in storage has precedence over value value
					const rawStoredValue = this.storage.getItem(this.key);
					if (rawStoredValue) {
						value = JSON.parse(rawStoredValue).value;
					}
				}
			}
			this.storage.setItem(options.key, JSON.stringify({ value }));
		}

		this.store = writable(value, start);
		this.subscribe = this.store.subscribe;
	}

	/**
	 * @public
	 * @param {T} value
	 */
	set(value) {
    if (isBrowser && this.storage) {
		  this.storage.setItem(this.key, JSON.stringify({ value }));
    }
		this.store.set(value);
	}

	/**
	 * @public
	 * @param {import('svelte/store').Updater<T>} updater
   */
	update(updater) {
		const value = updater(get(this.store));
		this.set(value);
	}

	/** @returns {T} */
	current() {
		return get(this.store);
	}
}
