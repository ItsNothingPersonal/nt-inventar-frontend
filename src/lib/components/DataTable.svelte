<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';
	import { editMode, selectedId } from '$lib/storeClient';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { DataObject } from '$lib/types/dataRow';
	import type { PBUser } from '$lib/types/user';
	import { UserRoles } from '$lib/types/userRoles';
	import { isNotNullOrUndefined, startCsvDownload } from '$lib/util';
	import type { ActionResult } from '@sveltejs/kit';
	import { EditIcon, XIcon } from 'svelte-feather-icons';
	import { Modal } from '.';
	import type { DBField } from '../types/dataField';
	import Image from './Image.svelte';
	import ImageModalDialog from './ImageModalDialog.svelte';

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
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	{#if $editMode === true}
		<div class="pb-4">
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
	<table class="table table-zebra w-full">
		<thead>
			<tr>
				{#if user?.role === UserRoles.INVENTARIST && $editMode === true && !disableEdit}
					<th scope="col" class="w-3" />
					<th scope="col" class="w-3" />
				{/if}

				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as dataRow}
				<tr>
					{#if user?.role === UserRoles.INVENTARIST && $editMode === true && !disableEdit}
						<td>
							<Modal label="update-button" checked={modalOpen}>
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
								form="singleDeleteForm"
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
								id="singleDeleteForm"
							>
								<input hidden class="hidden" name="id" value={dataRow['id']} />
							</form>
						</td>
						<td>
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
							<td> {dataRow['expand'][dataField.name][dataField.fieldName ?? '']} </td>
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
											width={512}
										/>
									</ImageModalDialog>
								{:else}
									<span>Nicht vorhanden</span>
								{/if}
							</td>
						{:else}
							<td>{dataRow[dataField.name]}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				{#if user?.role === UserRoles.INVENTARIST && $editMode === true && !disableEdit}
					<th scope="col" class="w-3" />
					<th scope="col" class="w-3" />
				{/if}

				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}
			</tr>
		</tfoot>
	</table>
</div>
