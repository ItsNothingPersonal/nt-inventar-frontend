import { getLagerorte } from '$lib/server/pocketbase';
import { lagerortStore } from '$lib/server/storeServer';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const lagerorte = await getLagerorte(locals.pb);
	lagerortStore.set(lagerorte);

	return {
		lagerorte: JSON.parse(JSON.stringify(lagerorte))
	};
}) satisfies PageServerLoad;
