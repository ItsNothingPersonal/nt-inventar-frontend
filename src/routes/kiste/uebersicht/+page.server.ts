import { getKisten } from '$lib/server/pocketbase';
import type { Kiste } from '$lib/types/kiste';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ kisten: Kiste[] }> => {
	const kisten = await getKisten(locals.pb);
	return {
		kisten: JSON.parse(JSON.stringify(kisten))
	};
}) satisfies PageServerLoad;
