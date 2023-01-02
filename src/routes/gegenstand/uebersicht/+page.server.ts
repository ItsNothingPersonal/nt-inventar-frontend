import { getGegenstaende } from '$lib/server/pocketbase';
import type { Gegenstand } from '$lib/types/gegenstand';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ gegenstaende: Gegenstand[] }> => {
	const gegenstaende = await getGegenstaende(locals.pb);
	return {
		gegenstaende: JSON.parse(JSON.stringify(gegenstaende))
	};
}) satisfies PageServerLoad;
