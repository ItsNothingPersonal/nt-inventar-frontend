<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { DataTable, Select } from '$lib/components';
	import type { ActionResult } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	let loading: boolean;
	$: loading = false;

	let checked: boolean;
	$: checked = false;

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

<DataTable
	data={data.flatOrder}
	dataFields={[
		{ value: 'id', fieldName: 'name', detailsLink: 'kiste', sortKey: 'name' },
		{
			value: 'expand.bestellung.id',
			fieldName: 'projekt.name',
			detailsLink: 'bestellung',
			isExpanded: true,
			sortKey: 'expand.bestellung.projekt.name'
		},
		{ value: 'bild', isImage: true }
	]}
	user={data.user}
	enhanceForm={submitEnhance}
	csvName="bestellungen.csv"
	enableReset={true}
	textHeadingReset="Bestellung zurücksetzen"
	disableEdit={true}
	initialSortField="bestellung"
>
	<form
		action="?/resetOrder"
		method="post"
		class="space-y-2"
		enctype="multipart/form-data"
		use:enhance={submitEnhance}
		slot="formReset"
		id="formReset"
	>
		<Select
			id="projekt"
			label="Projekt"
			options={data.projekte.map((p) => p.name)}
			required={true}
			disabled={loading}
			value={data.projekte.length > 0 ? data.projekte[0].name : ''}
		/>
		<button type="submit" class="btn btn-primary w-full" disabled={loading}>
			Projekt zurücksetzen
		</button>
	</form>
</DataTable>
