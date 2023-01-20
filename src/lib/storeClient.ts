import { writable, type Writable } from 'svelte/store';

export const editMode: Writable<boolean> = writable(false);
export const selectedId: Writable<string> = writable('');
export const selectedTheme: Writable<string> = writable('');
