import type { Kiste } from '$lib/types/kiste';
import type { Lagerort } from '$lib/types/lagerort';
import type { Projekt } from '$lib/types/projekt';
import { writable, type Writable } from 'svelte/store';

export const projektStore: Writable<Projekt[]> = writable([] as Projekt[]);
export const lagerortStore: Writable<Lagerort[]> = writable([] as Lagerort[]);
export const kistenStore: Writable<Kiste[]> = writable([] as Kiste[]);
