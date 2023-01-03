<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';
	import { deleteMode } from '$lib/store';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { PBUser } from '$lib/types/user';
	import { UserRoles } from '$lib/types/userRoles';
	import type { DBField } from '../types/dataField';
	import ImageModalDialog from './ImageModalDialog.svelte';

	export let tableHeaders: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any[] = [];
	export let dataFields: DBField[] = [];
	export let user: PBUser | undefined;
	export let disableDelete: boolean = false;

	$: innerWidth = 0;
	$: innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="overflow-x-auto">
	<table class="table table-zebra w-full">
		<thead>
			<tr>
				{#if user?.role === UserRoles.INVENTARIST && $deleteMode === true && !disableDelete}
					<th class="w-3" />
				{/if}

				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as dataRow}
				<tr>
					{#if user?.role === UserRoles.INVENTARIST && $deleteMode === true && !disableDelete}
						<th class="w-3">
							<form method="post" action="?/delete" use:enhance>
								<input hidden class="hidden" name="id" value={dataRow['id']} />
								{#if innerWidth <= BreakPoints.Large}
									<button class="btn btn-sm btn-square btn-primary" type="submit">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/></svg
										>
									</button>
								{:else}
									<button class="btn btn-sm btn-primary" type="submit"> Löschen </button>
								{/if}
							</form>
						</th>
					{/if}
					{#each dataFields as dataField}
						{#if dataField.isExpanded}
							<td>{dataRow['expand'][dataField.name][dataField.fieldName ?? '']} </td>
						{:else if dataField.isImage}
							<td>
								{#if dataRow[dataField.name]}
									<ImageModalDialog
										id={dataRow[dataField.name]}
										imageSrc={`${PUBLIC_PB_BASE_URL}/api/files/${dataRow['collectionName']}/${
											dataRow['id']
										}/${dataRow[dataField.name]}?thumb=WxHf`}
									>
										<img
											id={`img-${dataRow[dataField.name]}`}
											alt="Modal des Bildes"
											src={`${PUBLIC_PB_BASE_URL}/api/files/${dataRow['collectionName']}/${
												dataRow['id']
											}/${dataRow[dataField.name]}`}
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
	</table>
</div>
