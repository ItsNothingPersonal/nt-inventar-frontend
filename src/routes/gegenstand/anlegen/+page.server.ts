import type { FormGegenstandCreate } from '$lib/server/formGegenstandCreate';
import { getKisten } from '$lib/server/pocketbase';
import type { Kiste } from '$lib/types/kiste';
import { UserRoles } from '$lib/types/userRoles';
import { isNotNullOrUndefined, serializeNonPOJOs } from '$lib/util';
import { redirect } from '@sveltejs/kit';
import { get, writable, type Writable } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

const kistenStore: Writable<Kiste[]> = writable([] as Kiste[]);

export const load = (async ({ locals }): Promise<{ kisten: string[] }> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (locals.user?.role !== UserRoles.INVENTARIST) {
		throw redirect(303, '/gegenstand/uebersicht');
	}

	const kisten = await getKisten(locals.pb);
	kistenStore.set(kisten);

	return {
		kisten: kisten.map((x: Kiste) => x.name)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createGegenstand: async ({ locals, request }) => {
		const formData = await request.formData();
		const data: FormGegenstandCreate = Object.fromEntries(formData) as FormGegenstandCreate;

		const kistenInStore: Kiste[] = get(kistenStore);
		const kiste: Kiste | undefined = kistenInStore.find(
			(kisteStore) => kisteStore.name === formData.get('kiste')
		);
		formData.set('kiste', kiste?.id ?? '');

		const bild: File = formData.get('bild') as File;

		if (isNotNullOrUndefined(bild) && bild.size === 0) {
			formData.delete('bild');
		}

		try {
			await locals.pb.collection('gegenstaende').create(formData);
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
				name: data.name,
				kiste: data.kiste
			}
		};
	}
};
