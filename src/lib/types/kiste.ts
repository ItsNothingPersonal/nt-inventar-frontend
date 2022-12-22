import type { Lagerort } from './lagerort';
import type { Projekt } from './projekt';

export interface Kiste {
	name: string;
	projekt: Projekt;
	lagerort: Lagerort;
}
