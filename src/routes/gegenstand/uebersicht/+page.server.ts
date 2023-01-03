import { getGegenstaende } from '$lib/server/pocketbase';
import type { Gegenstand } from '$lib/types/gegenstand';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ gegenstaende: Gegenstand[] }> => {
	const gegenstaende = await getGegenstaende(locals.pb);
	return {
		gegenstaende: JSON.parse(JSON.stringify(gegenstaende))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();

		await locals.pb.collection('gegenstaende').delete(formData.get('id'));

		return { success: true };
	}
};
