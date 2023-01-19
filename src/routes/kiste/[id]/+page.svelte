<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { DataTable, Image, Input, Select } from '$lib/components';
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

	selectedId.subscribe(
		(id) => (updateGegenstand = data.gegenstaende.find((k: { id: string }) => k.id === id))
	);

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
	<h1 class="text-4xl font-bold mb-4">{data.kiste?.name}</h1>
	<label for="lagerort">
		<span class="font-bold"> Lagerort: </span>
	</label>
	<a
		id="lagerort"
		class="underline underline-offset-4 decoration-dotted print:no-underline hover:cursor-pointer"
		href={`${$page.url.origin}/lagerort/${data.kiste?.expand.lagerort.id}`}
	>
		{data.kiste?.expand.lagerort.name}
	</a>

	<DataTable
		data={data.gegenstaende}
		dataFields={[{ name: 'name' }, { name: 'anzahl' }, { name: 'bild', isImage: true }]}
		tableHeaders={['Name', 'Anzahl', 'Bild']}
		user={data.user}
		textButtonNeu="Gegenstand anlegen"
		textButtonBearbeiten="Gegenstand aktualisieren"
		enhanceDelete={submitEnhance}
		csvName="{`kiste-${data.kiste.name}`}.csv"
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
			<Select
				id="kiste"
				label="Kiste"
				options={data.kisten}
				required={true}
				disabled={loading}
				value={data.kiste.name}
			/>
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

			<button type="submit" class="btn btn-primary w-full" disabled={loading}>
				Aktualisieren
			</button>
		</form>
	</DataTable>
</div>
