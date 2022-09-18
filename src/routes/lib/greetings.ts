import Store from '$lib/store';

class MyStore extends Store<string> {
	greet(value: string) {
		this.value.set(value);
	}
}

const store = new MyStore('Hi');

export default store;
