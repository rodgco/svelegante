import Store from 'svelegante';

/**
* @extends {Store<string>}
*/
class MyStore extends Store {
  /** @param {string} value */
	greet(value) {
		this.value.set(value);
	}
}

const store = new MyStore('Hi');

export default store;
