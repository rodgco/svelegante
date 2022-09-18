import { writable } from 'svelte/store';
import type { Readable, Writable, Subscriber, Unsubscriber } from 'svelte/store';

export default class SVReadable<T> implements Readable<T> {
	protected value: Writable<T>;
	public subscribe: (
		run: Subscriber<T>,
		invalidate: (value: T | undefined) => void
	) => Unsubscriber;

	constructor(initial: T) {
		this.value = writable(initial);
		this.subscribe = this.value.subscribe;
	}
}
