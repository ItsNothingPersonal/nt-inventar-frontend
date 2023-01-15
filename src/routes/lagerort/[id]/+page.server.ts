import { getKistenByLagerortId, getLagerortById } from '$lib/server/pocketbase';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const lagerort = await getLagerortById(locals.pb, params.id);
	const kisten = await getKistenByLagerortId(locals.pb, params.id);

	return {
		lagerort: JSON.parse(JSON.stringify(lagerort)),
		kisten: JSON.parse(JSON.stringify(kisten))
	};
}) satisfies PageServerLoad;
