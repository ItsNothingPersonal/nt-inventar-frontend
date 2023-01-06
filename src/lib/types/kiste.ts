import type { Lagerort } from './lagerort';
import type { Projekt } from './projekt';

export interface Kiste {
	id: string;
	name: string;
	expand: {
		projekt: Projekt;
		lagerort: Lagerort;
	};
}
