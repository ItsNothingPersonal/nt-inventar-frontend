<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, DataTable, Image, Input, Select } from '$lib/components';
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
			{ value: 'name' },
			{ value: 'anzahl' },
			{
				value: 'expand.kiste.id',
				isExpanded: true,
				fieldName: 'name',
				detailsLink: 'kiste',
				sortKey: 'expand.kiste.name'
			},
			{ value: 'bild', isImage: true }
		]}
		user={data.user}
		textHeadingNeu="Gegenstand anlegen"
		textButtonBearbeiten="Gegenstand aktualisieren"
		enhanceForm={submitEnhance}
		csvName="gegenstaende.csv"
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
			<Input
				id="anzahl"
				label="Anzahl"
				value={form?.data?.anzahl ?? 0}
				required={true}
				disabled={loading}
				type="number"
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

			<Button label="Anlegen" disabled={loading} type="submit" fullWidth={true} />
		</form>
		<form
			action="?/update"
			method="post"
			class="space-y-2"
			enctype="multipart/form-data"
			use:enhance={submitEnhance}
			slot="formAktualisieren"
			id="formAktualisieren{updateGegenstand?.id}"
		>
			<Input id="id" hidden required={true} disabled={loading} value={updateGegenstand?.id ?? ''} />
			<Input
				id="name"
				label="Name"
				value={updateGegenstand?.name ?? ''}
				required={true}
				disabled={loading}
			/>
			<Input
				id="anzahl"
				label="Anzahl"
				value={updateGegenstand?.anzahl ?? 0}
				required={true}
				disabled={loading}
				type="number"
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
					height={460}
					width={460}
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

			<Button label="Aktualisieren" disabled={loading} type="submit" fullWidth={true} />
		</form>
	</DataTable>
</div>
