import type { Kiste } from './kiste';
import type { Projekt } from './projekt';

export type FlattendKisteAndBestellung = Kiste & {
	expand: { bestellung: { id: string; projekt: Projekt; besteller: string } };
};
