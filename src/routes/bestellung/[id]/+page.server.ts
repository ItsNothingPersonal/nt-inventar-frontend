import { getBestellungenById } from '$lib/server/pocketbase';
import { UserRoles } from '$lib/types/userRoles';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (!locals.pb.authStore.isValid || locals.user?.role !== UserRoles.INVENTARIST) {
		throw redirect(303, '/');
	}

	const bestellungen = await getBestellungenById(locals.pb, params.id);

	return {
		bestellung: JSON.parse(JSON.stringify(bestellungen))
	};
}) satisfies PageServerLoad;
