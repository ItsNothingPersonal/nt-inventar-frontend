import { getProjekte } from '$lib/server/pocketbase';
import type { Projekt } from '$lib/types/projekt';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ projekte: Projekt[] }> => {
	const projekte = await getProjekte(locals.pb);
	return {
		projekte: JSON.parse(JSON.stringify(projekte))
	};
}) satisfies PageServerLoad;
