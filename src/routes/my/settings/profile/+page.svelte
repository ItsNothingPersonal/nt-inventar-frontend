<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components';
	import { getImageURL, isNotNullOrUndefined } from '$lib/util';
	import type { ActionResult } from '@sveltejs/kit';
	import { EditIcon } from 'svelte-feather-icons';
	import type { PageData } from './$types';

	export let data: PageData;
	let loading: boolean;

	$: loading = false;

	const showPreview = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const files = target?.files;

		if (isNotNullOrUndefined(files) && files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview: HTMLImageElement = document.getElementById(
				'avatar-preview'
			) as HTMLImageElement;
			preview.src = src;
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

<div class="flex flex-col w-full h-full">
	<form
		action="?/updateProfile"
		method="post"
		class="flex flex-col space-y-2 w-full"
		enctype="multipart/form-data"
		use:enhance={submitUpdateProfile}
	>
		<div class="w-full">
			<h3 class="text-2xl font-medium"><h3 class="text-2xl">Profil</h3></h3>
			<div class="divider" />
		</div>
		<div class="form-control w-full max-w-lg">
			<label for="avatar" class="label font-medium pb-1">
				<span class="label-text"> Profil Bild </span>
			</label>
			<label for="avatar" class="avatar w-32 rounded-full hover:cursor-pointer">
				<label for="avatar" class="absolute -bottom-0.5 -right-0.5 hover:cursor-pointer">
					<span class="btn btn-circle btn-sm btn-secondary w-8 h-8">
						<EditIcon />
					</span>
				</label>
				<div class="w-32 rounded-full">
					<img
						src={data.user?.avatar
							? getImageURL(data.user.collectionId, data.user.id, data.user.avatar)
							: `https://ui-avatars.com/api/?name=${data.user?.name}`}
						alt="user avatar"
						id="avatar-preview"
					/>
				</div>
			</label>
			<input
				type="file"
				name="avatar"
				id="avatar"
				value=""
				accept="image/*"
				hidden
				on:change={showPreview}
				disabled={loading}
			/>
		</div>
		<Input id="name" label="Name" value={data?.user?.name} disabled={loading} />
		<div class="w-full max-w-lg pt-3">
			<button class="btn btn-primary w-full max-w-lg" type="submit" disabled={loading}>
				Profil aktualisieren
			</button>
		</div>
	</form>
	<div class="divider" />
	<Input id="rolle" label="Rolle" value={data?.user?.role} disabled={true} />
</div>
