<script lang="ts">
	import { applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { DataTable } from '$lib/components';
	import type { FlattendKisteAndBestellung } from '$lib/types/flattendKisteAndBestellung';
	import { sortByProjektNameAndKisteNameAsc } from '$lib/util';
	import type { ActionResult } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading: boolean;
	$: loading = false;

	const submitEnhance = () => {
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					applyAction(result);
					break;
			}
			loading = false;
		};
	};

	function kombinierteKistenUndBestellungsDaten() {
		const result: FlattendKisteAndBestellung[] = [];

		data.bestellungen.forEach((b) => {
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
							projekt: b.expand.projekt.name,
							besteller: b.expand.besteller.name
						}
					}
				};

				result.push(flatResult);
			});
		});

		return result;
	}
</script>

<DataTable
	data={kombinierteKistenUndBestellungsDaten().sort(sortByProjektNameAndKisteNameAsc)}
	dataFields={[
		{ name: 'name', detailsLink: 'kiste' },
		{ name: 'bestellung', detailsLink: true, isExpanded: true, fieldName: 'projekt' },
		{ name: 'bild', isImage: true }
	]}
	tableHeaders={['Kiste', 'Bestellung', 'Bild']}
	user={data.user}
	enhanceForm={submitEnhance}
	csvName="bestellungen.csv"
/>
