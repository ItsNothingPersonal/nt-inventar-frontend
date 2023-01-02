<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<DataTable
		data={data.projekte}
		dataFields={[{ name: 'name' }, { name: 'projektverantwortlicher' }]}
		tableHeaders={['Name', 'Projektverantwortliche/r']}
	/>
</div>
