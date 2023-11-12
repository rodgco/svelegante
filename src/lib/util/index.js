/** @type {boolean} */
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

/** @type {boolean} */
export const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

/** @type {Storage | null} */
export const localStorage = isBrowser ? window.localStorage : null;

/** @type {Storage | null} */
export const sessionStorage = isBrowser ? window.sessionStorage : null;

