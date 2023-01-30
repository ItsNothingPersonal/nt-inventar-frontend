import {
	getBestellungByProjektId,
	getBestellungen,
	getGegenstaendeForKiste,
	getKisteById,
	getKisten,
	getProjektByUserId
} from '$lib/server/pocketbase';
import { gegenstaendeStore, kistenStore } from '$lib/server/storeServer';
import type { Bestellung } from '$lib/types/bestellung';
import type { BestellungAnlegen } from '$lib/types/bestellungAnlegen';
import type { Gegenstand } from '$lib/types/gegenstand';
import type { Kiste } from '$lib/types/kiste';
import type { Projekt } from '$lib/types/projekt';
import { isNotNullOrUndefined, isNullOrUndefined, serializeNonPOJOs } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

let kisteInBearbeitung: Kiste | undefined = undefined;

export const load = (async ({
	locals,
	params
}): Promise<{
	gegenstaende: Gegenstand[];
	kiste: Kiste;
	kisten: string[];
	bestellungen: Bestellung[];
	userProject: Projekt | undefined;
}> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const gegenstaende = await getGegenstaendeForKiste(locals.pb, params.id);
	gegenstaendeStore.set(gegenstaende);

	kisteInBearbeitung = await getKisteById(locals.pb, params.id);

	const kistenFromStore = get(kistenStore);
	if (isNotNullOrUndefined(kistenFromStore)) {
		const kisten = await getKisten(locals.pb);
		kistenStore.set(kisten);
	}

	const bestellungen = await getBestellungen(locals.pb);
	const userProject = await getProjektByUserId(locals.pb, locals.user?.projekt);

	return {
		gegenstaende: JSON.parse(JSON.stringify(gegenstaende)),
		kiste: JSON.parse(JSON.stringify(kisteInBearbeitung)),
		kisten: kistenFromStore.map((x: Kiste) => x.name),
		bestellungen: JSON.parse(JSON.stringify(bestellungen)),
		userProject: isNotNullOrUndefined(userProject)
			? JSON.parse(JSON.stringify(userProject))
			: undefined
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ locals, request }) => {
		const formData = await request.formData();

		const kistenInStore: Kiste[] = get(kistenStore);
		const kiste: Kiste | undefined = kistenInStore.find(
			(kisteStore) => kisteStore.name === formData.get('kiste')
		);
		formData.set('kiste', kiste?.id ?? '');

		const bild: File = formData.get('bild') as File;

		if (isNotNullOrUndefined(bild) && bild.size === 0) {
			formData.delete('bild');
		} else {
			formData.set('bild', bild);
		}

		try {
			await locals.pb.collection('gegenstaende').create(formData);
		} catch (error: unknown) {
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
				anzahl: parseInt(formData.get('anzahl') as string),
				kiste: formData.get('kiste') as string
			}
		};
	},
	update: async ({ locals, request }) => {
		const formData = await request.formData();

		const kistenInStore: Kiste[] = get(kistenStore);
		const kiste: Kiste | undefined = kistenInStore.find(
			(kisteStore) => kisteStore.name === formData.get('kiste')
		);
		formData.set('kiste', kiste?.id ?? '');

		const bild: File = formData.get('bild-neu') as File;

		if (isNullOrUndefined(bild) || (isNotNullOrUndefined(bild) && bild.size === 0)) {
			formData.delete('bild');
		} else {
			formData.set('bild', bild);
		}

		try {
			await locals.pb.collection('gegenstaende').update(formData.get('id'), formData);
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
				anzahl: parseInt(formData.get('anzahl') as string),
				kiste: formData.get('kiste') as string
			}
		};
	},
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const deletionIds = formData.getAll('id') as string[];

		deletionIds.forEach(async (id) => {
			try {
				await locals.pb.collection('gegenstaende').delete(id);
			} catch (error) {
				console.error(
					`Es ist ein Fehler beim Versuch, den Gegenstand mit ID ${id} zu löschen, aufgetreten: ${error}`
				);
				return {
					error: true,
					message: 'Es ist ein Fehler beim Löschen des Gegenstands aufgetreten.'
				};
			}
		});

		return { success: true, data: undefined };
	},
	order: async ({ locals, request }) => {
		const formData = await request.formData();
		const kisteId = formData.get('id') as string;
		const projectId = formData.get('projectId') as string;
		console.warn(`kisteId: ${kisteId} projectId: ${projectId}`);
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
	},
	orderRemove: async ({ locals, request }) => {
		const formData = await request.formData();
		const kisteId = formData.get('id') as string;
		const projectId = formData.get('projectId') as string;

		console.warn(`kisteId: ${kisteId} projectId: ${projectId}`);
		const existingOrder = await getBestellungByProjektId(locals.pb, projectId);
		console.warn(JSON.stringify(existingOrder, undefined, 2));

		if (existingOrder) {
			const updateOrder: BestellungAnlegen = {
				kiste: [...existingOrder.kiste.filter((existingKisteId) => existingKisteId !== kisteId)],
				besteller: locals.user?.id,
				projekt: projectId
			};

			try {
				if (updateOrder.kiste.length === 0) {
					await locals.pb.collection('bestellungen').delete(existingOrder.id);
				} else {
					await locals.pb.collection('bestellungen').update(existingOrder.id, updateOrder);
				}
			} catch (err) {
				return {
					error: true,
					message: `Fehler beim Entfernen einer Kiste aus der bestehenden Bestellung: ${
						(err as Error).message
					}`
				};
			}
		}

		return { success: true, data: undefined };
	}
};
