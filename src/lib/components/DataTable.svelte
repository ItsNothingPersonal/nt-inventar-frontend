<script lang="ts">
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';
	import type { DBField } from '../types/dataField';
	import ImageModalDialog from './ImageModalDialog.svelte';

	export let tableHeaders: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let data: any[] = [];
	export let dataFields: DBField[] = [];
</script>

<div class="overflow-x-auto w-full">
	<table class="table w-full">
		<thead>
			<tr>
				{#each tableHeaders as tableHeader}
					<th scope="col">{tableHeader}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as dataRow}
				<tr>
					{#each dataFields as dataField}
						{#if dataField.isExpanded}
							<td>{dataRow['expand'][dataField.name][dataField.fieldName ?? '']} </td>
						{:else if dataField.isImage}
							<td>
								<ImageModalDialog
									imageSrc={`${PUBLIC_PB_BASE_URL}/api/files/${dataRow['collectionName']}/${
										dataRow['id']
									}/${dataRow[dataField.name]}?thumb=WxHf`}
								>
									<img
										alt="Modal des Bildes ${dataRow[dataField.name]}"
										src={`${PUBLIC_PB_BASE_URL}/api/files/${dataRow['collectionName']}/${
											dataRow['id']
										}/${dataRow[dataField.name]}`}
									/>
								</ImageModalDialog>
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
