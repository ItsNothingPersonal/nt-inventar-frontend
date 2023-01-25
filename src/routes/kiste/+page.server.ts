import {
	getBestellungByProjektId,
	getBestellungen,
	getKisten,
	getLagerorte,
	getProjektByUserId
} from '$lib/server/pocketbase';
import { kistenStore, lagerortStore } from '$lib/server/storeServer';
import type { Bestellung } from '$lib/types/bestellung';
import type { BestellungAnlegen } from '$lib/types/bestellungAnlegen';
import type { Kiste } from '$lib/types/kiste';
import type { Lagerort } from '$lib/types/lagerort';
import type { Projekt } from '$lib/types/projekt';
import { isNotNullOrUndefined, isNullOrUndefined, serializeNonPOJOs } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({
	locals
}): Promise<{
	kisten: Kiste[];
	lagerorte: string[];
	bestellungen: Bestellung[];
	userProject: Projekt | undefined;
}> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const lagerorte = await getLagerorte(locals.pb);
	lagerortStore.set(lagerorte);

	const kisten = await getKisten(locals.pb);
	kistenStore.set(kisten);

	const bestellungen = await getBestellungen(locals.pb);
	const userProject = await getProjektByUserId(locals.pb, locals.user?.projekt);

	return {
		kisten: JSON.parse(JSON.stringify(kisten)),
		lagerorte: lagerorte.map((x: Lagerort) => x.name),
		bestellungen: JSON.parse(JSON.stringify(bestellungen)),
		userProject: isNotNullOrUndefined(userProject)
			? JSON.parse(JSON.stringify(userProject))
			: undefined
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ locals, request }) => {
		const formData = await request.formData();

		const lagerortInStore: Lagerort[] = get(lagerortStore);
		const lagerort: Lagerort | undefined = lagerortInStore.find(
			(lagerortStore) => lagerortStore.name === formData.get('lagerort')
		);
		formData.set('lagerort', lagerort?.id ?? '');

		const bild: File = formData.get('bild') as File;
		if (isNotNullOrUndefined(bild) && bild.size === 0) {
			formData.delete('bild');
		} else {
			formData.set('bild', bild);
		}

		try {
			await locals.pb.collection('kisten').create(formData);
		} catch (error) {
			console.error(error);
			return {
				error: true,
				message: (error as Error).message
			};
		}

		return {
			success: true,
			data: {
				name: formData.get('name') as string,
				lagerort: formData.get('kiste') as string
			}
		};
	},
	update: async ({ locals, request }) => {
		const formData = await request.formData();

		const lagerortInStore: Lagerort[] = get(lagerortStore);
		const lagerort: Lagerort | undefined = lagerortInStore.find(
			(lagerortStore) => lagerortStore.name === formData.get('lagerort')
		);
		formData.set('lagerort', lagerort?.id ?? '');

		const bild: File = formData.get('bild-neu') as File;
		if (isNullOrUndefined(bild) || (isNotNullOrUndefined(bild) && bild.size === 0)) {
			formData.delete('bild');
		} else {
			formData.set('bild', bild);
		}

		try {
			await locals.pb.collection('kisten').update(formData.get('id'), formData);
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
				name: formData.get('name') as string,
				lagerort: formData.get('kiste') as string
			}
		};
	},
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const deletionIds = formData.getAll('id') as string[];

		deletionIds.forEach(async (id) => {
			try {
				await locals.pb.collection('kisten').delete(id);
			} catch (error) {
				console.error(
					`Es ist ein Fehler beim Versuch, die Kiste mit id ${id} zu löschen, aufgetreten: ${error}`
				);
				return {
					error: true,
					message: 'Es ist ein Fehler beim Versuch, die Kiste zu löschen, aufgetreten.'
				};
			}
		});

		return { success: true, data: undefined };
	},
	order: async ({ locals, request }) => {
		const formData = await request.formData();
		const kisteId = formData.get('id') as string;
		const projectId = formData.get('projectId') as string;

		const existingOrder = await getBestellungByProjektId(locals.pb, projectId);

		if (existingOrder) {
			const updateOrder: BestellungAnlegen = {
				kiste: [kisteId, ...existingOrder.kiste],
				besteller: locals.user?.id,
				projekt: projectId
			};

			try {
				await locals.pb.collection('bestellungen').update(existingOrder.id, updateOrder);
			} catch (err) {
				return {
					error: true,
					message: `Fehler beim Aktualisieren der bestehenden Bestellung: ${(err as Error).message}`
				};
			}
		} else {
			const createOrder: BestellungAnlegen = {
				kiste: [kisteId],
				besteller: locals.user?.id,
				projekt: projectId
			};

			try {
				await locals.pb.collection('bestellungen').create(createOrder);
			} catch (err) {
				return {
					error: true,
					message: `Fehler beim Erstellen der neuen Bestellung: ${(err as Error).message}`
				};
			}
		}

		return { success: true, data: undefined };
	}
};
