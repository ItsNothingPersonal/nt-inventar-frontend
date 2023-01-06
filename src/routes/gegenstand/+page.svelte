<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input, Select } from '$lib/components';
	import DataTable from '$lib/components/DataTable.svelte';
	import Image from '$lib/components/Image.svelte';
	import { selectedId } from '$lib/storeClient';
	import type { Gegenstand } from '$lib/types/gegenstand';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading: boolean;
	$: loading = false;

	let updateGegenstand: Gegenstand | undefined;
	$: updateGegenstand = undefined;

	selectedId.subscribe((id) => (updateGegenstand = data.gegenstaende.find((k) => k.id === id)));

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
		data={data.gegenstaende}
		dataFields={[
			{ name: 'name' },
			{ name: 'bild', isImage: true },
			{ name: 'kiste', isExpanded: true, fieldName: 'name' }
		]}
		tableHeaders={['Name', 'Bild', 'Kiste']}
		user={data.user}
		textButtonNeu="Gegenstand anlegen"
		textButtonBearbeiten="Gegenstand aktualisieren"
		enhanceDelete={submitEnhance}
	>
		<form
			action="?/create"
			method="post"
			class="space-y-2"
			enctype="multipart/form-data"
			use:enhance={submitEnhance}
			slot="formNeu"
		>
			<Input
				id="name"
				label="Name"
				value={form?.data?.name ?? ''}
				required={true}
				disabled={loading}
			/>
			<Select id="kiste" label="Kiste" options={data.kisten} required={true} disabled={loading} />
			<Input
				label="Bild"
				id="bild"
				type="file"
				accept="image/*"
				disabled={loading}
				cssClass="file-input file-input-bordered w-full max-w-lg"
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
		>
			<Input id="id" hidden required={true} disabled={loading} value={updateGegenstand?.id ?? ''} />
			<Input
				id="name"
				label="Name"
				value={updateGegenstand?.name ?? ''}
				required={true}
				disabled={loading}
			/>
			<Select
				id="kiste"
				label="Kiste"
				options={data.kisten}
				required={true}
				disabled={loading}
				value={updateGegenstand?.expand.kiste.name ?? ''}
			/>
			{#if updateGegenstand?.bild}
				<Image
					imageName={updateGegenstand?.bild ?? ''}
					imageCollection="gegenstaende"
					itemId={updateGegenstand?.id ?? ''}
					label="Aktuelles Bild"
				/>
			{/if}
			<Input
				label="Neues Bild"
				id="bild-neu"
				type="file"
				accept="image/*"
				disabled={loading}
				cssClass="file-input file-input-bordered w-full max-w-lg"
			/>

			<button type="submit" class="btn btn-primary w-full" disabled={loading}>
				Aktualisieren
			</button>
		</form>
	</DataTable>
</div>
