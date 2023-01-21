import { getKisten, getLagerorte } from '$lib/server/pocketbase';
import { kistenStore, lagerortStore } from '$lib/server/storeServer';
import type { Kiste } from '$lib/types/kiste';
import type { Lagerort } from '$lib/types/lagerort';
import { isNotNullOrUndefined, isNullOrUndefined, serializeNonPOJOs } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ kisten: Kiste[]; lagerorte: string[] }> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const lagerorte = await getLagerorte(locals.pb);
	lagerortStore.set(lagerorte);

	const kisten = await getKisten(locals.pb);
	kistenStore.set(kisten);

	return {
		kisten: JSON.parse(JSON.stringify(kisten)),
		lagerorte: lagerorte.map((x: Lagerort) => x.name)
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
	}
};
