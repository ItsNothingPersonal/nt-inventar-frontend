<script lang="ts">
	import { DataTable } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full h-full px-2">
	<DataTable
		data={data.lagerorte}
		dataFields={[{ name: 'name', detailsLink: true }]}
		tableHeaders={['Name']}
		user={data.user}
		csvName="lagerorte.csv"
		disableEdit={true}
	/>
</div>
