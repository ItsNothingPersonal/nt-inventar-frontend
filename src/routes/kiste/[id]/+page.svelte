<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { DataTable, Image, Input, Select, ToggleButton } from '$lib/components';
	import { Label } from '$lib/constants';
	import { editMode, selectedId } from '$lib/storeClient';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { Gegenstand } from '$lib/types/gegenstand';
	import { UserRoles } from '$lib/types/userRoles';
	import { getImageURL, isNullOrUndefined } from '$lib/util';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const modalStore = getModalStore();

	$: innerWidth = 0;
	$: innerHeight = 0;

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

	function alreadyOrdered(id: string, projectId: string | undefined): boolean {
		if (isNullOrUndefined(projectId)) return false;

		return (
			data.bestellungen?.some(
				(order) => order.kiste.includes(id) && order.expand.projekt?.id === projectId
			) ?? false
		);
	}

	function modalComponentImage(image: string, source: string): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'imageModalDialog',
			image,
			meta: { source }
		};
		modalStore.trigger(modal);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="w-full h-full px-2">
	<div>
		<h1 class="text-4xl font-bold mb-4">{data.kiste?.name}</h1>
	</div>

	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-x-2">
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
		</div>
		<div class="flex flex-row gap-x-2 print:hidden">
			<label for={data.kiste?.bild}>
				<span class="font-bold"> Bild: </span>
			</label>
			{#if data.kiste.bild}
				<div
					role="button"
					on:click={() => {
						if (data.kiste.bild) {
							modalComponentImage(
								getImageURL('kisten', data.kiste.id, data.kiste.bild, '128x128'),
								data.kiste?.bild ?? ' K'
							);
						}
					}}
					on:keyup={() => {
						if (data.kiste.bild) {
							modalComponentImage(
								getImageURL('kisten', data.kiste.id, data.kiste.bild, '128x128'),
								data.kiste?.bild ?? ' K'
							);
						}
					}}
					tabindex="0"
				>
					<Image
						imageCollection="kisten"
						imageName={data.kiste.bild}
						itemId={data.kiste.id}
						alt="Modal des Bildes"
						height={48}
						width={48}
					/>
				</div>
			{:else}
				<span>Nicht vorhanden</span>
			{/if}
		</div>
		{#if $editMode === true && data.user?.role === UserRoles.SPIELLEITUNG}
			<div class="flex flex-row items-baseline gap-x-2 print:hidden">
				<label for="buttonOrder">
					<span class="font-bold"> Bestellstatus: </span>
				</label>
				<ToggleButton
					id="buttonOrder"
					toggled={alreadyOrdered(data.kiste.id, data.userProject?.id)}
					isMobile={innerWidth <= BreakPoints.Large}
					labelNotToggled={{
						desktop: Label.BESTELLEN,
						mobile: 'ic:baseline-plus',
						form: `order-${data.kiste.id}`
					}}
					labelToggled={{
						desktop: Label.BESTELLT,
						mobile: 'ic:baseline-plus',
						form: `order-remove-${data.kiste.id}`
					}}
					isSmall={true}
				/>
			</div>
			<form method="post" action="?/order" use:enhance={submitEnhance} id="order-{data.kiste.id}">
				<input hidden class="hidden" name="id" value={data.kiste.id} />
				<input hidden class="hidden" name="projectId" value={data.userProject?.id} />
			</form>
			<form
				method="post"
				action="?/orderRemove"
				use:enhance={submitEnhance}
				id="order-remove-{data.kiste.id}"
			>
				<input hidden class="hidden" name="id" value={data.kiste.id} />
				<input hidden class="hidden" name="projectId" value={data.userProject?.id} />
			</form>
		{:else if data.user?.role === UserRoles.INVENTARIST || data.user?.role === UserRoles.SPIELLEITUNG}
			<div class="flex flex-row gap-x-2">
				<label for="lagerort">
					<span class="font-bold"> Bestellstatus: </span>
				</label>
				{alreadyOrdered(data.kiste.id, data.userProject?.id) ? 'Bestellt' : 'Nicht bestellt'}
			</div>
		{/if}
	</div>
	<div class="divider" />
	<DataTable
		data={data.gegenstaende}
		dataFields={[{ value: 'name' }, { value: 'anzahl' }, { value: 'bild', isImage: true }]}
		user={data.user}
		textHeadingNeu="Gegenstand anlegen"
		textButtonBearbeiten="Gegenstand aktualisieren"
		enhanceForm={submitEnhance}
		csvName="{`kiste-${data.kiste.name}`}.csv"
		initialSortField="name"
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
