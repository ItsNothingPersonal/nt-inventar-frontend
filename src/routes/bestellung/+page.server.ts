import { getBestellungen } from '$lib/server/pocketbase';
import type { Bestellung } from '$lib/types/bestellung';
import { UserRoles } from '$lib/types/userRoles';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({
	locals
}): Promise<{
	bestellungen: Bestellung[];
}> => {
	if (!locals.pb.authStore.isValid || locals.user?.role !== UserRoles.INVENTARIST) {
		throw redirect(303, '/');
	}

	const bestellungen = await getBestellungen(locals.pb);

	return {
		bestellungen: JSON.parse(JSON.stringify(bestellungen))
	};
}) satisfies PageServerLoad;
