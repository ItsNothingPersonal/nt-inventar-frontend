<script lang="ts">
	import { DataTable } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<h1 class="text-4xl font-bold mb-4">{data.lagerort.name}</h1>

	<DataTable
		data={data.kisten}
		dataFields={[{ name: 'name', detailsLink: 'kiste' }]}
		tableHeaders={['Name']}
		user={data.user}
		disableEdit={true}
		csvName="{`lagerort-${data.lagerort.name}`}.csv"
	/>
</div>
