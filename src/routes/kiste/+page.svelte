<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input, Select } from '$lib/components';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

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
		enhanceDelete={submitEnhance}
	>
		<form
			action="?/create"
			method="post"
			class="space-y-2"
			enctype="multipart/form-data"
			use:enhance={submitEnhance}
			slot="form-neu"
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
	</DataTable>
</div>
