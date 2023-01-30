import type { Kiste } from './kiste';
import type { Projekt } from './projekt';
import type { PBUser } from './user';

export interface Bestellung {
	id: string;
	kiste: string[];
	besteller: string;
	projekt: string;
	expand: {
		kiste: Kiste[];
		besteller: PBUser;
		projekt: Projekt;
	};
}
