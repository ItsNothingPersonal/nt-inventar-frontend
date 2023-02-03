<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';
	import { Label } from '$lib/constants';
	import { editMode, selectedId } from '$lib/storeClient';
	import type { Bestellung } from '$lib/types/bestellung';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { DataObject } from '$lib/types/dataRow';
	import type { NestedKeyOf } from '$lib/types/nestedKeyOf';
	import type { PBUser } from '$lib/types/user';
	import { UserRoles } from '$lib/types/userRoles';
	import { isNotNullOrUndefined, isNullOrUndefined, startCsvDownload } from '$lib/util';
	import type { ActionResult } from '@sveltejs/kit';
	import { get as lget } from 'lodash-es';
	import { afterUpdate, onMount } from 'svelte';
	import {
		DownloadIcon,
		EditIcon,
		MinusSquareIcon,
		PlusSquareIcon,
		SkipBackIcon,
		XIcon
	} from 'svelte-feather-icons';
	import { writable, type Writable } from 'svelte/store';
	import { Button, Image, ImageModalDialog, Modal, ModalTriggerButton, ToggleButton } from '.';
	import type { DBField } from '../types/dataField';
	import SortArrow from './SortArrow.svelte';

	type T = $$Generic;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: T[] = [];
	export let dataFields: DBField<T>[] = [] as DBField<T>[];
	export let user: PBUser | undefined = undefined;
	export let disableEdit = false;
	export let textHeadingNeu = '';
	export let textButtonBearbeiten = '';
	export let enhanceForm:
		| (() => ({ result }: { result: ActionResult }) => Promise<void>)
		| undefined = undefined;
	export let csvName: string;
	export let allowSLOrders = false;
	export let orders: Bestellung[] | undefined = undefined;
	export let userProject: string | undefined = undefined;
	export let disableSubComponents = false;
	export let textHeadingReset: string | undefined = undefined;
	export let enableReset: boolean = false;

	let dataStore: Writable<T[]> = writable([]);
	let sortStore: Writable<{ field: string; sort: 'asc' | 'desc' }> = writable({
		field: '',
		sort: 'asc'
	});
	let tableHeaderStore: Writable<string[]> = writable([]);
	let headerToFieldValueStore: Writable<Map<string, NestedKeyOf<T>>> = writable(
		new Map<string, NestedKeyOf<T>>()
	);

	let tableHeaders: string[];
	$: tableHeaders = [];

	onMount(() => {
		dataStore.set(data);
		tableHeaderStore.set(
			dataFields.flatMap((e) => {
				const detailsLinkOrFieldName = e.detailsLink
					? e.detailsLink.toString()
					: e.fieldName?.toString() ?? undefined;
				const key = detailsLinkOrFieldName ?? e.value;
				headerToFieldValueStore.update((s) =>
					s.set(key.toLowerCase(), e.sortKey ? e.sortKey : e.value)
				);
				return key;
			})
		);
	});

	afterUpdate(() => {
		dataStore.set(data);
	});

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
				trimmedRow[field.value] = lget(row, field.value) as string;
			});
			downloadData.push(trimmedRow);
		});

		startCsvDownload(
			downloadData,
			dataFields.map((entry) =>
				isNotNullOrUndefined(entry.fieldName) && entry.isExpanded !== true
					? entry.fieldName
					: entry.value
			),
			csvName
		);
	}

	function alreadyOrdered(id: string | any, projectId: string | undefined): boolean {
		if (isNullOrUndefined(projectId)) return false;

		return (
			orders?.some((order) => order.kiste.includes(id) && order.expand.projekt?.id === projectId) ??
			false
		);
	}

	function handleSortClick(tableHeader: string) {
		const lcHeader = tableHeader.toLowerCase();
		const valueSource: NestedKeyOf<T> | undefined = $headerToFieldValueStore.get(lcHeader);

		if ($sortStore.field !== lcHeader) {
			sortStore.set({ field: lcHeader, sort: 'asc' });
		} else {
			if ($sortStore.sort === 'asc') {
				$sortStore.sort = 'desc';
			} else {
				$sortStore.sort = 'asc';
			}
		}

		let result: T[];
		if ($sortStore.sort === 'asc') {
			result = $dataStore.sort((a, b) => {
				return sortDataAsc(
					lget(a, valueSource ?? '') as string,
					lget(b, valueSource ?? '') as string
				);
			});
		} else {
			result = $dataStore.sort((a, b) =>
				sortDataDesc(lget(a, valueSource ?? '') as string, lget(b, valueSource ?? '') as string)
			);
		}

		dataStore.set(result);
	}

	function sortDataAsc(a: string, b: string): number {
		return a < b ? -1 : a > b ? 1 : 0;
	}

	function sortDataDesc(a: string, b: string): number {
		return a < b ? 1 : a > b ? -1 : 0;
	}

	function getToString(dataRow: T, field: string): string {
		return lget(dataRow, field) as string;
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="relative overflow-x-auto shadow-md print:shadow-none sm:rounded-lg mt-4">
	{#if $editMode === true}
		<div class="pb-4 print:hidden flex flex-row items-center gap-2">
			{#if user?.role === UserRoles.INVENTARIST && !disableEdit}
				<Modal label="create-button" checked={modalOpen}>
					<ModalTriggerButton slot="trigger" label="Neu" icon={PlusSquareIcon} />
					<h3 slot="heading">{textHeadingNeu}</h3>
					<slot name="formNeu" />
				</Modal>
				<Button
					form="massDeleteForm"
					label="Massen-Löschen"
					icon={XIcon}
					isSecondary={true}
					type="submit"
				/>
			{/if}
			{#if user?.role === UserRoles.INVENTARIST && enableReset}
				<Modal label="reset-button" checked={modalOpen}>
					<ModalTriggerButton slot="trigger" label="Reset" icon={SkipBackIcon} />
					<h3 slot="heading">{textHeadingReset}</h3>
					<slot name="formReset" />
				</Modal>
			{/if}
			<Button label="CSV-Download" onClick={download} icon={DownloadIcon} />
			<form
				method="post"
				action="?/delete"
				id="massDeleteForm"
				use:enhance={enhanceForm}
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
				{#if $editMode === true}
					{#if user?.role === UserRoles.INVENTARIST && !disableEdit}
						<th scope="col" class="w-3 print:hidden" />
						<th scope="col" class="w-3 print:hidden" />
					{:else if user?.role === UserRoles.SPIELLEITUNG && allowSLOrders}
						<th scope="col" class="w-3 print:hidden"> Bestellung </th>
					{/if}
				{/if}
				{#each $tableHeaderStore as tableHeader (tableHeader)}
					<th scope="col" on:click={() => handleSortClick(tableHeader)}>
						<div class="flex flex-row items-center gap-x-2">
							{tableHeader}
							<SortArrow
								active={$sortStore.field === tableHeader}
								sortedAsc={$sortStore.sort === 'asc'}
							/>
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each $dataStore as dataRow (lget(dataRow, 'id'))}
				<tr>
					{#if $editMode === true}
						{#if user?.role === UserRoles.INVENTARIST && !disableEdit}
							<td class="print:hidden">
								<Modal label="update-button-{lget(dataRow, 'id')}" checked={modalOpen}>
									<ModalTriggerButton
										slot="trigger"
										label="Aktualisieren"
										icon={EditIcon}
										onClick={() => selectedId.set(`${lget(dataRow, 'id')}`)}
										onKeyDown={() => selectedId.set(`${lget(dataRow, 'id')}`)}
									/>
									<h3 slot="heading">{textButtonBearbeiten}</h3>
									<slot name="formAktualisieren" />
								</Modal>
								<Button
									label="Löschen"
									form="singleDeleteForm{lget(dataRow, 'id')}"
									icon={XIcon}
									type="submit"
								/>
								<form
									method="post"
									action="?/delete"
									use:enhance={enhanceForm}
									id="singleDeleteForm{lget(dataRow, 'id')}"
								>
									<input hidden class="hidden" name="id" value={lget(dataRow, 'id')} />
								</form>
							</td>
							<td class="print:hidden">
								<label>
									<input
										type="checkbox"
										class="checkbox"
										bind:group={checkboxValues}
										value={lget(dataRow, 'id')}
										id={`delete-checkbox-${lget(dataRow, 'id')}`}
									/>
								</label>
							</td>
						{:else if user?.role === UserRoles.SPIELLEITUNG && allowSLOrders}
							<td class="print:hidden">
								<ToggleButton
									id="buttonOrder{lget(dataRow, 'id')}"
									toggled={alreadyOrdered(lget(dataRow, 'id', 'test'), userProject)}
									isMobile={innerWidth <= BreakPoints.Large}
									disabled={disableSubComponents}
									labelNotToggled={{
										desktop: Label.BESTELLEN,
										mobile: PlusSquareIcon,
										form: `order-${lget(dataRow, 'id')}`
									}}
									labelToggled={{
										desktop: Label.BESTELLT,
										mobile: MinusSquareIcon,
										form: `order-remove-${lget(dataRow, 'id')}`
									}}
								/>
								<form
									method="post"
									action="?/order"
									use:enhance={enhanceForm}
									id="order-{lget(dataRow, 'id')}"
								>
									<input hidden class="hidden" name="id" value={lget(dataRow, 'id')} />
									<input hidden class="hidden" name="projectId" value={userProject} />
								</form>
								<form
									method="post"
									action="?/orderRemove"
									use:enhance={enhanceForm}
									id="order-remove-{lget(dataRow, 'id')}"
								>
									<input hidden class="hidden" name="id" value={lget(dataRow, 'id')} />
									<input hidden class="hidden" name="projectId" value={userProject} />
								</form>
							</td>
						{/if}
					{/if}
					{#each dataFields as dataField}
						{#if dataField.isExpanded}
							{#if dataField.detailsLink}
								<td>
									<a
										class="underline underline-offset-4 decoration-dotted print:no-underline hover:cursor-pointer"
										href="{$page.url.origin}/{dataField.detailsLink ?? ''}/{lget(
											dataRow,
											dataField.value ?? ''
										)}"
									>
										{lget(
											dataRow,
											`expand.${dataField.detailsLink.toString() ?? ''}.${dataField.fieldName}`
										)}
									</a>
								</td>
							{:else}
								<td> {lget(dataRow, dataField.value)} </td>
							{/if}
						{:else if dataField.isImage}
							<td>
								{#if lget(dataRow, dataField.value)}
									<ImageModalDialog
										id={getToString(dataRow, dataField.value)}
										imageSrc={`${PUBLIC_PB_BASE_URL}/api/files/${lget(
											dataRow,
											'collectionName'
										)}/${lget(dataRow, 'id')}/${lget(dataRow, dataField.value)}`}
									>
										<Image
											imageCollection={getToString(dataRow, 'collectionName')}
											imageName={getToString(dataRow, dataField.value)}
											itemId={getToString(dataRow, 'id')}
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
									href="{$page.url.origin}/{dataField.detailsLink ?? ''}/{lget(
										dataRow,
										dataField.value ?? ''
									)}"
								>
									{lget(dataRow, dataField.fieldName ? dataField.fieldName : dataField.value ?? '')}
								</a>
							</td>
						{:else}
							<td> {lget(dataRow, dataField.value ?? '')} </td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				{#if $editMode === true}
					{#if user?.role === UserRoles.INVENTARIST && !disableEdit}
						<th scope="col" class="w-3 print:hidden" />
						<th scope="col" class="w-3 print:hidden" />
					{:else if user?.role === UserRoles.SPIELLEITUNG && allowSLOrders}
						<th scope="col" class="w-3 print:hidden"> Bestellung </th>
					{/if}
				{/if}

				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}
			</tr>
		</tfoot>
	</table>
</div>
