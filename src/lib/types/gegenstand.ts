import type { Kiste } from './kiste';

export interface Gegenstand {
	name: string;
	bild: string;
	collectionName: string;
	id: string;
	expand: {
		kiste: Kiste;
	};
}
