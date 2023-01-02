<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<DataTable
		data={data.gegenstaende}
		dataFields={[
			{ name: 'name' },
			{ name: 'bild', isImage: true },
			{ name: 'kiste', isExpanded: true, fieldName: 'name' }
		]}
		tableHeaders={['Name', 'Bild', 'Kiste']}
	/>
</div>
