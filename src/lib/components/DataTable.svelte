<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';
	import { editMode, selectedId } from '$lib/storeClient';
	import type { Bestellung } from '$lib/types/bestellung';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { DataObject } from '$lib/types/dataRow';
	import type { PBUser } from '$lib/types/user';
	import { UserRoles } from '$lib/types/userRoles';
	import { isNotNullOrUndefined, isNullOrUndefined, startCsvDownload } from '$lib/util';
	import type { ActionResult } from '@sveltejs/kit';
	import { EditIcon, PlusSquareIcon, XIcon } from 'svelte-feather-icons';
	import { Image, ImageModalDialog, Modal } from '.';
	import type { DBField } from '../types/dataField';

	export let tableHeaders: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any[] = [];
	export let dataFields: DBField[] = [];
	export let user: PBUser | undefined = undefined;
	export let disableEdit = false;
	export let textButtonNeu = '';
	export let textButtonBearbeiten = '';
	export let enhanceDelete:
		| (() => ({ result }: { result: ActionResult }) => Promise<void>)
		| undefined = undefined;
	export let csvName: string;
	export let allowSLOrders = false;
	export let orders: Bestellung[] | undefined = undefined;
	export let userProject: string | undefined = undefined;

	let modalOpen: boolean;
	let checkboxValues: string[] = [];

	$: innerWidth = 0;
	$: innerHeight = 0;
	$: modalOpen = false;

	async function download() {
		const downloadData: DataObject[] = [];

		data.map((row) => {
			let trimmedRow: DataObject = {} as DataObject;
			dataFields.forEach((field) => {
				if (field.isExpanded) {
					trimmedRow[field.name] = row['expand'][field.name][field.fieldName ?? ''];
				} else {
					trimmedRow[field.name] = row[field.name];
				}
			});
			downloadData.push(trimmedRow);
		});

		startCsvDownload(
			downloadData,
			dataFields.map((entry) =>
				isNotNullOrUndefined(entry.fieldName) && entry.isExpanded !== true
					? entry.fieldName
					: entry.name
			),
			csvName
		);
	}

	function alreadyOrdered(id: string, projectId: string | undefined): boolean {
		if (isNullOrUndefined(projectId)) return false;

		return (
			orders?.some((order) => order.kiste.includes(id) && order.expand.projekt?.id === projectId) ??
			false
		);
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="relative overflow-x-auto shadow-md print:shadow-none sm:rounded-lg mt-4">
	{#if $editMode === true}
		<div class="pb-4 print:hidden">
			{#if user?.role === UserRoles.INVENTARIST && !disableEdit}
				<Modal label="create-button" checked={modalOpen}>
					<span slot="trigger" class="btn btn-active btn-primary"> Neu </span>
					<h3 slot="heading">{textButtonNeu}</h3>
					<slot name="formNeu" />
				</Modal>
				<input type="submit" form="massDeleteForm" value="Massen-Löschen" class="btn btn-active" />
			{/if}
			<button class="btn btn-active btn-primary" type="submit" on:click={download}>
				CSV-Download
			</button>
			<form
				method="post"
				action="?/delete"
				id="massDeleteForm"
				use:enhance={enhanceDelete}
				on:submit={() => (checkboxValues = [])}
			>
				{#each checkboxValues as idToDelete}
					<input hidden class="hidden" name="id" value={idToDelete} />
				{/each}
			</form>
		</div>
	{/if}
	<table class="table table-zebra print:table-compact w-full">
		<thead>
			<tr>
				{#if user?.role === UserRoles.INVENTARIST && $editMode === true && !disableEdit}
					<th scope="col" class="w-3 print:hidden" />
					<th scope="col" class="w-3 print:hidden" />
				{/if}

				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}

				{#if user?.role === UserRoles.SPIELLEITUNG && $editMode === true && allowSLOrders}
					<th scope="col" class="w-3 print:hidden"> Bestellung </th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each data as dataRow}
				<tr>
					{#if user?.role === UserRoles.INVENTARIST && $editMode === true && !disableEdit}
						<td class="print:hidden">
							<Modal label="update-button-{dataRow['id']}" checked={modalOpen}>
								<span
									slot="trigger"
									class="btn {innerWidth <= BreakPoints.Large ? 'btn-square' : ''} btn-primary"
									on:keydown={() => selectedId.set(`${dataRow['id']}`)}
									on:click={() => selectedId.set(`${dataRow['id']}`)}
								>
									{#if innerWidth <= BreakPoints.Large}
										<EditIcon />
									{:else}
										Aktualisieren
									{/if}
								</span>
								<h3 slot="heading">{textButtonBearbeiten}</h3>
								<slot name="formAktualisieren" />
							</Modal>
							<button
								class="btn {innerWidth <= BreakPoints.Large ? 'btn-square' : ''} btn-primary"
								type="submit"
								form="singleDeleteForm{dataRow['id']}"
							>
								{#if innerWidth <= BreakPoints.Large}
									<XIcon />
								{:else}
									Löschen
								{/if}
							</button>
							<form
								method="post"
								action="?/delete"
								use:enhance={enhanceDelete}
								id="singleDeleteForm{dataRow['id']}"
							>
								<input hidden class="hidden" name="id" value={dataRow['id']} />
							</form>
						</td>
						<td class="print:hidden">
							<label>
								<input
									type="checkbox"
									class="checkbox"
									bind:group={checkboxValues}
									value={dataRow['id']}
									id={`delete-checkbox-${dataRow['id']}`}
								/>
							</label>
						</td>
					{/if}
					{#each dataFields as dataField}
						{#if dataField.isExpanded}
							{#if dataField.detailsLink}
								<td>
									<a
										class="underline underline-offset-4 decoration-dotted print:no-underline hover:cursor-pointer"
										href="{typeof dataField.detailsLink === 'string'
											? `${$page.url.origin}/${dataField.detailsLink}`
											: $page.url.pathname}/{dataRow['expand'][dataField.name]['id']}"
									>
										{dataRow['expand'][dataField.name][dataField.fieldName ?? '']}
									</a>
								</td>
							{:else}
								<td> {dataRow['expand'][dataField.name][dataField.fieldName ?? '']} </td>
							{/if}
						{:else if dataField.isImage}
							<td>
								{#if dataRow[dataField.name]}
									<ImageModalDialog
										id={dataRow[dataField.name]}
										imageSrc={`${PUBLIC_PB_BASE_URL}/api/files/${dataRow['collectionName']}/${
											dataRow['id']
										}/${dataRow[dataField.name]}`}
									>
										<Image
											imageCollection={dataRow['collectionName']}
											imageName={dataRow[dataField.name]}
											itemId={dataRow['id']}
											alt="Modal des Bildes"
											height={512}
											width={512}
										/>
									</ImageModalDialog>
								{:else}
									<span class="w-12 h-12"> n/a </span>
								{/if}
							</td>
						{:else if dataField.detailsLink}
							<td>
								<a
									class="underline underline-offset-4 decoration-dotted print:no-underline hover:cursor-pointer"
									href="{typeof dataField.detailsLink === 'string'
										? `${$page.url.origin}/${dataField.detailsLink}`
										: $page.url.pathname}/{dataRow['id']}"
								>
									{dataRow[dataField.name]}
								</a>
							</td>
						{:else}
							<td> {dataRow[dataField.name]} </td>
						{/if}
					{/each}
					{#if user?.role === UserRoles.SPIELLEITUNG && $editMode === true && allowSLOrders}
						<td class="print:hidden">
							<button
								class="btn {innerWidth <= BreakPoints.Large ? 'btn-square' : ''} btn-primary"
								type="submit"
								form="order{dataRow['id']}"
								id="buttonOrder{dataRow['id']}"
								disabled={alreadyOrdered(dataRow['id'], userProject)}
							>
								{#if innerWidth <= BreakPoints.Large}
									<PlusSquareIcon />
								{:else}
									Bestellen
								{/if}
							</button>
							<form
								method="post"
								action="?/order"
								use:enhance={enhanceDelete}
								id="order{dataRow['id']}"
							>
								<input hidden class="hidden" name="id" value={dataRow['id']} />
								<input hidden class="hidden" name="projectId" value={userProject} />
							</form>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				{#if user?.role === UserRoles.INVENTARIST && $editMode === true && !disableEdit}
					<th scope="col" class="w-3 print:hidden" />
					<th scope="col" class="w-3 print:hidden" />
				{/if}

				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}

				{#if user?.role === UserRoles.SPIELLEITUNG && $editMode === true && allowSLOrders}
					<th scope="col" class="w-3 print:hidden"> Bestellung </th>
				{/if}
			</tr>
		</tfoot>
	</table>
</div>
