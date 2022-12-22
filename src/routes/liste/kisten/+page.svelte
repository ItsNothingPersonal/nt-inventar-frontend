<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<DataTable
	data={data.kisten}
	dataFields={[
		{ name: 'name' },
		{ name: 'projekt', isExpanded: true, fieldName: 'name' },
		{ name: 'lagerort', isExpanded: true, fieldName: 'name' }
	]}
	tableHeaders={['Name', 'Projekt', 'Lagerort']}
/>
