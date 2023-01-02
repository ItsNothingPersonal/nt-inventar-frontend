import type { FormKisteCreate } from '$lib/server/formKisteCreate';
import { getLagerorte, getProjekte } from '$lib/server/pocketbase';
import type { Lagerort } from '$lib/types/lagerort';
import type { Projekt } from '$lib/types/projekt';
import { UserRoles } from '$lib/types/userRoles';
import { serializeNonPOJOs } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { get, writable, type Writable } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

const projektStore: Writable<Projekt[]> = writable([] as Projekt[]);
const lagerortStore: Writable<Lagerort[]> = writable([] as Lagerort[]);

export const load = (async ({ locals }): Promise<{ projekte: string[]; lagerorte: string[] }> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user?.role !== UserRoles.INVENTARIST) {
		throw redirect(303, '/kiste/uebersicht');
	}

	const projekte = await getProjekte(locals.pb);
	projektStore.set(projekte);

	const lagerorte = await getLagerorte(locals.pb);
	lagerortStore.set(lagerorte);

	return {
		projekte: projekte.map((x: Projekt) => x.name),
		lagerorte: lagerorte.map((x: Lagerort) => x.name)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createKiste: async ({ locals, request }) => {
		const formData = await request.formData();
		const data: FormKisteCreate = Object.fromEntries(formData) as FormKisteCreate;

		const projekteInStore: Projekt[] = get(projektStore);
		const projekt: Projekt | undefined = projekteInStore.find(
			(projektStore) => projektStore.name === formData.get('projekt')
		);
		data.projekt = projekt?.id ?? '';

		const lagerortInStore: Lagerort[] = get(lagerortStore);
		const lagerort: Lagerort | undefined = lagerortInStore.find(
			(lagerortStore) => lagerortStore.name === formData.get('lagerort')
		);
		data.lagerort = lagerort?.id ?? '';

		try {
			await locals.pb.collection('kisten').create(data);
		} catch (error) {
			console.error(error);
			return {
				error: true,
				message: serializeNonPOJOs(error)
			};
		}

		return {
			success: true,
			data: {
				name: data.name
			}
		};
	}
};
