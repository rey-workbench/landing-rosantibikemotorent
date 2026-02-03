import { writable } from 'svelte/store';

export const loadingProgress = writable(0);
export const isLoaded = writable(false);
