import type { Kiste } from './kiste';

export type FlattendKisteAndBestellung = Kiste & {
	expand: { bestellung: { id: string; projekt: string; besteller: string } };
};
