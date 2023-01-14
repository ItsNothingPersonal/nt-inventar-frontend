import type { Gegenstand } from '$lib/types/gegenstand';
import type { Kiste } from '$lib/types/kiste';
import type { Lagerort } from '$lib/types/lagerort';
import { writable, type Writable } from 'svelte/store';

export const lagerortStore: Writable<Lagerort[]> = writable([] as Lagerort[]);
export const kistenStore: Writable<Kiste[]> = writable([] as Kiste[]);
export const gegenstaendeStore: Writable<Gegenstand[]> = writable([] as Gegenstand[]);
