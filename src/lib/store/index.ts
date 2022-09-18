import { writable, get } from 'svelte/store';
import type {
	Writable,
	Subscriber,
	Unsubscriber,
	Updater,
	StartStopNotifier,
} from 'svelte/store';
import { noop } from 'svelte/internal';

export default class Store<T> implements Writable<T> {
	protected value: Writable<T>;
	public subscribe: (run: Subscriber<T>, invalidate?: (value?: T) => void) => Unsubscriber;

	public set: (value: T) => void;
	public update: (updater: Updater<T>) => void;

	constructor(initial?: T, start: StartStopNotifier<T> = noop) {
		this.value = writable(initial, start);
		this.subscribe = this.value.subscribe;
		this.set = this.value.set;
		this.update = this.value.update;
	}

	current(): T {
		return get(this.value);
	}
}
