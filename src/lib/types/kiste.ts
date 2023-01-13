import type { Lagerort } from './lagerort';

export interface Kiste {
	id: string;
	name: string;
	expand: {
		lagerort: Lagerort;
	};
}
