import { getGegenstaendeForKiste, getKisteById, getKisten } from '$lib/server/pocketbase';
import { gegenstaendeStore, kistenStore } from '$lib/server/storeServer';
import type { Kiste } from '$lib/types/kiste';
import { isNotNullOrUndefined, isNullOrUndefined, serializeNonPOJOs } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

let kisteInBearbeitung: Kiste | undefined = undefined;

export const load = (async ({ locals, params }) => {
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

	return {
		gegenstaende: JSON.parse(JSON.stringify(gegenstaende)),
		kiste: JSON.parse(JSON.stringify(kisteInBearbeitung)),
		kisten: kistenFromStore.map((x: Kiste) => x.name)
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
	}
};
