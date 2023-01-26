import type { Kiste } from './kiste';

export interface Gegenstand {
	id: string;
	collectionName: string;
	name: string;
	bild?: string;
	anzahl: number;
	expand: {
		kiste: Kiste;
	};
}
