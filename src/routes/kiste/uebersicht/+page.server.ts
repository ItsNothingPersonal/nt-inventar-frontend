import { getKisten } from '$lib/server/pocketbase';
import type { Kiste } from '$lib/types/kiste';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ kisten: Kiste[] }> => {
	const kisten = await getKisten(locals.pb);
	return {
		kisten: JSON.parse(JSON.stringify(kisten))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();

		await locals.pb.collection('kisten').delete(formData.get('id'));

		return { success: true };
	}
};
