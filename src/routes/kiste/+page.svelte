<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, DataTable, Image, Input, Select } from '$lib/components';
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
			{ value: 'id', fieldName: 'name', detailsLink: 'kiste', sortKey: 'name' },
			{
				value: 'expand.lagerort.id',
				isExpanded: true,
				fieldName: 'name',
				detailsLink: 'lagerort',
				sortKey: 'expand.lagerort.name'
			},
			{ value: 'bild', isImage: true }
		]}
		user={data.user}
		textHeadingNeu="Kiste anlegen"
		textButtonBearbeiten="Kiste aktualisieren"
		enhanceForm={submitEnhance}
		csvName="kisten.csv"
		allowSLOrders={true}
		orders={data.bestellungen}
		userProject={data.userProject?.id}
		disableSubComponents={loading}
		initialSortField="lagerort"
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
				id="lagerort"
				label="Lagerort"
				options={data.lagerorte}
				required={true}
				disabled={loading}
			/>
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
				id="lagerort"
				label="Lagerort"
				options={data.lagerorte}
				required={true}
				disabled={loading}
				value={updateKiste?.expand.lagerort.name}
			/>
			{#if updateKiste?.bild}
				<Image
					imageName={updateKiste?.bild ?? ''}
					imageCollection="kisten"
					itemId={updateKiste?.id ?? ''}
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
