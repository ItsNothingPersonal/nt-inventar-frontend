<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	let loading: boolean;
	$: loading = false;

	const submitUpdateForm = () => {
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

<h3 class="text-2xl font-medium">EMail ändern</h3>
<form action="?/updateEMail" method="post" class="mb-4" use:enhance={submitUpdateForm}>
	<Input
		id="email"
		type="email"
		required={true}
		value={form?.data.email}
		label="Gib deine neue E-Mail-Adresse ein"
		disabled={loading}
		placeholder={data.user?.email}
	/>
	<Button type="submit" disabled={loading}>E-Mail-Adresse ändern</Button>
</form>

<h3 class="text-2xl font-medium">Benutzernamen ändern</h3>
<form action="?/updateUsername" method="post" class="mb-4" use:enhance={submitUpdateForm}>
	<Input
		id="username"
		type="text"
		required={true}
		value={form?.data.username}
		label="Gib deinen neuen Benutzernamen ein"
		disabled={loading}
		placeholder={data.user?.username}
	/>
	<Button type="submit" disabled={loading}>Benutzernamen ändern</Button>
</form>
