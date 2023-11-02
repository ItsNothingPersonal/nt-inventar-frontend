<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
	import { getImageURL, isNotNullOrUndefined } from '$lib/util';
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { ActionResult } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;
	let loading: boolean;
	$: loading = false;

	const showPreview = (event: Event) => {
		const target = event.target as HTMLInputElement;
		console.warn(target.files);
		const files = target?.files;

		if (isNotNullOrUndefined(files) && files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview: HTMLElement | null = document.getElementById('img-avatar-preview');
			if (isNotNullOrUndefined(preview)) {
				(preview as HTMLImageElement).src = src;
			}
		}
	};

	const submitUpdateProfile = () => {
		loading = true;
		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
				case 'error':
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};
</script>

<h3 class="text-2xl font-medium">Profil</h3>
<hr class="mb-2" />

<form
	action="?/updateProfile"
	method="post"
	enctype="multipart/form-data"
	use:enhance={submitUpdateProfile}
	class="mb-4"
>
	<label for="avatar" class="label font-medium pb-1"> Profil Bild </label>
	<div class="relative max-w-[128px] group">
		<label
			for="avatar"
			class="absolute bottom-0 left-20 hover:cursor-pointer w-32 z-10 mix-blend-hard-light text-primary-500"
		>
			<Icon icon="material-symbols:edit-document-outline" width={32} />
		</label>
		<Avatar
			src={data.user
				? getImageURL(data.user.collectionId, data.user.id, data.user.avatar, '128x128')
				: undefined}
			initials={data.user?.username.slice(0, 2)}
			id="img-avatar-preview"
			width="w-32"
			rounded="rounded-full"
		/>
	</div>
	<Input
		type="file"
		id="avatar"
		value=""
		accept="image/*"
		onChange={showPreview}
		disabled={loading}
		hidden
	/>

	<Input id="name" label="Name" value={data?.user?.name} disabled={loading} />
	<Button type="submit" disabled={loading}>Profil aktualisieren</Button>
</form>

<Input id="rolle" label="Rolle" value={data?.user?.role} disabled={true} />
{#if data.projekt?.name}
	<Input id="projekt" label="Projekt" value={data.projekt?.name} disabled={true} />
{/if}
