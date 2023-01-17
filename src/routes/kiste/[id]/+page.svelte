<script lang="ts">
	import { page } from '$app/stores';
	import DataTable from '$lib/components/DataTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<h1 class="text-4xl font-bold mb-4">{data.kiste?.name}</h1>
	<label for="lagerort">
		<span class="font-bold"> Lagerort: </span>
	</label>
	<a
		id="lagerort"
		class="underline underline-offset-4 decoration-dotted print:no-underline hover:cursor-pointer"
		href={`${$page.url.origin}/lagerort/${data.kiste?.expand.lagerort.id}`}
	>
		{data.kiste?.expand.lagerort.name}
	</a>

	<DataTable
		data={data.gegenstaende}
		dataFields={[{ name: 'name' }, { name: 'anzahl' }, { name: 'bild', isImage: true }]}
		tableHeaders={['Name', 'Anzahl', 'Bild']}
		user={data.user}
		disableEdit={true}
		csvName="{`gegenstaende-${data.kiste.name}`}.csv"
	/>
</div>
