import { writable, get } from 'svelte/store';
import { noop } from 'svelte/internal';

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
	value;

  /**
   * @public
   */
	subscribe; 

  /**
   * @public
   */
	set;

  /**
   * @public
   */
	update;

  /**
  * @constructor
  * @param {T} [initial]
  * @param {import('svelte/store').StartStopNotifier<T>} [start]
  */
	constructor(initial, start = noop) {
		this.value = writable(initial, start);
		this.subscribe = this.value.subscribe;
		this.set = this.value.set;
		this.update = this.value.update;
	}

  /** @returns {T} */
	current() {
		return get(this.value);
	}
}
