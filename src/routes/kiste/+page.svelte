<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input, Select } from '$lib/components';
	import DataTable from '$lib/components/DataTable.svelte';
	import { selectedId } from '$lib/storeClient';
	import type { Kiste } from '$lib/types/kiste';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading: boolean;
	$: loading = false;

	let updateKiste: Kiste | undefined;
	$: updateKiste = undefined;

	selectedId.subscribe((id) => (updateKiste = data.kisten.find((k) => k.id === id)));

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

<div class="w-full h-full px-2">
	<DataTable
		data={data.kisten}
		dataFields={[
			{ name: 'name' },
			{ name: 'projekt', isExpanded: true, fieldName: 'name' },
			{ name: 'lagerort', isExpanded: true, fieldName: 'name' }
		]}
		tableHeaders={['Name', 'Projekt', 'Lagerort']}
		user={data.user}
		textButtonNeu="Kiste anlegen"
		textButtonBearbeiten="Kiste aktualisieren"
		enhanceDelete={submitEnhance}
		csvName="kisten.csv"
	>
		<form
			action="?/create"
			method="post"
			class="space-y-2"
			enctype="multipart/form-data"
			use:enhance={submitEnhance}
			slot="formNeu"
		>
			<Input id="name" label="Name" value={form?.data?.name} required={true} disabled={loading} />
			<Select
				id="projekt"
				label="Projekt"
				options={data.projekte}
				required={true}
				disabled={loading}
			/>
			<Select
				id="lagerort"
				label="Lagerort"
				options={data.lagerorte}
				required={true}
				disabled={loading}
			/>

			<button type="submit" class="btn btn-primary w-full" disabled={loading}> Anlegen </button>
		</form>
		<form
			action="?/update"
			method="post"
			class="space-y-2"
			enctype="multipart/form-data"
			use:enhance={submitEnhance}
			slot="formAktualisieren"
			id="formAktualisieren{updateKiste?.id}"
		>
			<Input id="id" hidden required={true} disabled={loading} value={updateKiste?.id ?? ''} />
			<Input
				id="name"
				label="Name"
				required={true}
				disabled={loading}
				value={updateKiste?.name ?? ''}
			/>
			<Select
				id="projekt"
				label="Projekt"
				options={data.projekte}
				required={true}
				disabled={loading}
				value={updateKiste?.expand.projekt.name}
			/>
			<Select
				id="lagerort"
				label="Lagerort"
				options={data.lagerorte}
				required={true}
				disabled={loading}
				value={updateKiste?.expand.lagerort.name}
			/>

			<button type="submit" class="btn btn-primary w-full" disabled={loading}>
				Aktualisieren
			</button>
		</form>
	</DataTable>
</div>
