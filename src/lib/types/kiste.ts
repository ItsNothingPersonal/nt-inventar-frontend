import type { Lagerort } from './lagerort';

export interface Kiste {
	id: string;
	name: string;
	bild?: string;
	expand: {
		lagerort: Lagerort;
	};
}
