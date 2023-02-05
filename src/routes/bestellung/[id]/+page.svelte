<script lang="ts">
	import { applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { DataTable } from '$lib/components';
	import { sortByLagerortNameAndKisteNameAsc } from '$lib/util';
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
</script>

<div class="w-full h-full px-2 mb-8">
	<div>
		<h1 class="text-4xl font-bold mb-4">
			Bestellung {data.bestellung.expand.projekt.name}
		</h1>
	</div>

	<div class="flex flex-col gap-y-4">
		<div class="flex flex-row gap-x-2">
			<label for="lagerort">
				<span class="font-bold"> Letzter Besteller: </span>
			</label>
			<span>
				{data.bestellung.expand.besteller.name}
			</span>
		</div>
	</div>
	<DataTable
		data={data.bestellung.expand.kiste.sort(sortByLagerortNameAndKisteNameAsc)}
		dataFields={[
			{ value: 'name', detailsLink: 'kiste' },
			{ value: 'lagerort', isExpanded: true, fieldName: 'name', detailsLink: 'lagerort' },
			{ value: 'bild', isImage: true }
		]}
		user={data.user}
		enhanceForm={submitEnhance}
		csvName={`bestellungen-${data.bestellung.expand.projekt.name}.csv`}
		initialSortField="lagerort"
	/>
</div>
