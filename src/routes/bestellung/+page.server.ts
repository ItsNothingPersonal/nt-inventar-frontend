import { getBestellungByProjektId, getBestellungen, getProjekte } from '$lib/server/pocketbase';
import { projekteStore } from '$lib/server/storeServer';
import type { Bestellung } from '$lib/types/bestellung';
import type { FlattendKisteAndBestellung } from '$lib/types/flattendKisteAndBestellung';
import type { Projekt } from '$lib/types/projekt';
import { UserRoles } from '$lib/types/userRoles';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({
	locals
}): Promise<{
	flatOrder: FlattendKisteAndBestellung[];
	projekte: Projekt[];
}> => {
	if (!locals.pb.authStore.isValid || locals.user?.role !== UserRoles.INVENTARIST) {
		throw redirect(303, '/');
	}

	const bestellungen = await getBestellungen(locals.pb);
	const flat = kombinierteKistenUndBestellungsDaten(bestellungen);

	const projekte = await getProjekte(locals.pb);
	projekteStore.set(projekte);

	return {
		flatOrder: JSON.parse(JSON.stringify(flat)),
		projekte: JSON.parse(JSON.stringify(projekte))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	resetOrder: async ({ locals, request }) => {
		const formData = await request.formData();
		const deletionId = formData.get('projekt') as string;

		const projectID = get(projekteStore).find((p) => p.name === deletionId)?.id;
		const existingOrder = await getBestellungByProjektId(locals.pb, projectID ?? '');

		if (existingOrder) {
			try {
				await locals.pb.collection('bestellungen').delete(existingOrder.id);
			} catch (err) {
				return {
					error: true,
					message: `Fehler beim Entfernen einer Kiste aus der bestehenden Bestellung: ${
						(err as Error).message
					}`
				};
			}
		}

		return { success: true, data: undefined };
	}
};

function kombinierteKistenUndBestellungsDaten(
	bestellungen: Bestellung[]
): FlattendKisteAndBestellung[] {
	const result: FlattendKisteAndBestellung[] = [];

	bestellungen.forEach((b) => {
		b.expand.kiste.forEach((k) => {
			const flatResult: FlattendKisteAndBestellung = {
				id: k.id,
				collectionName: k.collectionName,
				name: k.name,
				bild: k.bild,
				expand: {
					lagerort: k.expand.lagerort,
					bestellung: {
						id: b.id,
						projekt: b.expand.projekt,
						besteller: b.expand.besteller?.name
					}
				}
			};

			result.push(flatResult);
		});
	});

	return result;
}
