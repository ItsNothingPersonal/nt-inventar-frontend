<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<h1 class="text-4xl font-bold">{data.kiste?.name}</h1>
	<DataTable
		data={data.gegenstaende}
		dataFields={[
			{ name: 'name' },
			{ name: 'anzahl' },
			{ name: 'bild', isImage: true },
			{ name: 'kiste', isExpanded: true, fieldName: 'name' }
		]}
		tableHeaders={['Name', 'Anzahl', 'Bild', 'Kiste']}
		user={data.user}
		disableEdit={true}
		csvName="{`gegenstaende-${data.kiste.name}`}.csv"
	/>
</div>
