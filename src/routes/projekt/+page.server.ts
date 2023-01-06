import { getProjekte } from '$lib/server/pocketbase';
import type { Projekt } from '$lib/types/projekt';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }): Promise<{ projekte: Projekt[] }> => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const projekte = await getProjekte(locals.pb);
	return {
		projekte: JSON.parse(JSON.stringify(projekte))
	};
}) satisfies PageServerLoad;
