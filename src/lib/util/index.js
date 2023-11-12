/** @type {boolean} */
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/** @type {boolean} */
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/** @type {localStorage | sessionStorage | null} */
const getLocalStorage = isBrowser ? window.localStorage : null;

/** @type {localStorage | sessionStorage | null} */
const getSessionStorage = isBrowser ? window.sessionStorage : null;

export { getLocalStorage, getSessionStorage, isBrowser, isNode };
