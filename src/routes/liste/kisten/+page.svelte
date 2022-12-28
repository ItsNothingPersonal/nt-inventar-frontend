<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<DataTable
		data={data.kisten}
		dataFields={[
			{ name: 'name' },
			{ name: 'projekt', isExpanded: true, fieldName: 'name' },
			{ name: 'lagerort', isExpanded: true, fieldName: 'name' }
		]}
		tableHeaders={['Name', 'Projekt', 'Lagerort']}
	/>
</div>
