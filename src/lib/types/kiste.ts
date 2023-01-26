import type { Lagerort } from './lagerort';

export interface Kiste {
	id: string;
	collectionName: string;
	name: string;
	bild?: string;
	expand: {
		lagerort: Lagerort;
	};
}
