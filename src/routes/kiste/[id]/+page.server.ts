import { getGegenstaendeForKiste, getKistenById } from '$lib/server/pocketbase';
import { gegenstaendeStore } from '$lib/server/storeServer';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	const gegenstaende = await getGegenstaendeForKiste(locals.pb, params.id);
	gegenstaendeStore.set(gegenstaende);

	const kiste = await getKistenById(locals.pb, params.id);

	return {
		gegenstaende: JSON.parse(JSON.stringify(gegenstaende)),
		kiste: JSON.parse(JSON.stringify(kiste))
	};
}) satisfies PageServerLoad;
