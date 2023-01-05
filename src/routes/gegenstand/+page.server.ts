import type { FormGegenstandCreate } from '$lib/server/formGegenstandCreate';
import { getGegenstaende, getKisten } from '$lib/server/pocketbase';
import type { Gegenstand } from '$lib/types/gegenstand';
import type { Kiste } from '$lib/types/kiste';
import { isNotNullOrUndefined, serializeNonPOJOs } from '$lib/util';
import { get, writable, type Writable } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

const kistenStore: Writable<Kiste[]> = writable([] as Kiste[]);

export const load = (async ({
	locals
}): Promise<{ gegenstaende: Gegenstand[]; kisten: string[] }> => {
	const gegenstaende = await getGegenstaende(locals.pb);

	const kisten = await getKisten(locals.pb);
	kistenStore.set(kisten);

	return {
		gegenstaende: JSON.parse(JSON.stringify(gegenstaende)),
		kisten: kisten.map((x: Kiste) => x.name)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ locals, request }) => {
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
	},
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const deletionIds = formData.getAll('id') as string[];

		deletionIds.forEach(async (id) => await locals.pb.collection('gegenstaende').delete(id));

		return { success: true, data: undefined };
	}
};
