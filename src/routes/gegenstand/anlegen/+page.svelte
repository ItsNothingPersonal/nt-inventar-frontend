<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components';
	import Select from '$lib/components/Select.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let loading: boolean;

	$: loading = false;

	const submitCreateGegenstand = () => {
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					applyAction(result);
					break;
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<div class="h-full px-2">
		<h2 class="text-3xl font-medium mt-4">Gegenstand anlegen</h2>
		<div class="divider" />
	</div>
	<div class="flex h-full space-x-4">
		<div class="w-full">
			<form
				action="?/createGegenstand"
				method="post"
				class="space-y-2"
				enctype="multipart/form-data"
				use:enhance={submitCreateGegenstand}
			>
				<Input id="name" label="Name" value={form?.data?.name} required={true} disabled={loading} />
				<Select id="kiste" label="Kiste" options={data.kisten} required={true} disabled={loading} />
				<Input
					label="Bild"
					id="bild"
					type="file"
					accept="image/*"
					disabled={loading}
					cssClass="file-input file-input-bordered w-full max-w-lg"
				/>

				<button type="submit" class="btn btn-primary w-full" disabled={loading}> Anlegen </button>
			</form>
		</div>
	</div>
</div>
