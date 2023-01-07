<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input, Modal } from '$lib/components';
	import AlertError from '$lib/components/AlertError.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { CodeIcon } from 'svelte-feather-icons';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let passwortresetModalOpen: boolean;
	let loading: boolean;

	$: passwortresetModalOpen = false;
	$: loading = false;

	const submitPasswortReset = () => {
		loading = true;
		passwortresetModalOpen = true;

		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					passwortresetModalOpen = false;
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
	<CodeIcon class="text-primary h-24 w-24" />
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Logg dich ein
	</h2>
	<p class="text-center mt-1">
		Oder <a href="/register" class="text-primary font-medium hover:cursor-pointer"
			>registrier dich</a
		> falls du noch keinen Account hast.
	</p>
	<div class="bg-white py-6 shadow-md rounded-lg w-full max-w-sm mt-6">
		<form method="POST" action="?/login" class="flex flex-col items-center space-y-2 w-full">
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label font-medium pb-1">
					<span class="label-text">Email</span>
				</label>
				<input type="email" name="email" class="input input-bordered w-full max-w-xs" />
			</div>
			<div class="form-control w-full max-w-xs">
				<label for="password" class="label font-medium pb-1">
					<span class="label-text">Passwort</span>
				</label>
				<input type="password" name="password" class="input input-bordered w-full max-w-xs" />
			</div>
			<div class="w-full max-w-xs pt-3">
				<button class="btn btn-primary w-full max-w-xs">Login</button>
			</div>
			<Modal label="reset-passwort" checked={passwortresetModalOpen}>
				<span slot="trigger" class="text-primary hover:cursor-point hover:underline">
					Ich habe mein Passwort vergessen
				</span>
				<h3 slot="heading">Passwort neu anfordern</h3>
				<form
					action="?/resetPassword"
					method="post"
					class="space-y-2"
					use:enhance={submitPasswortReset}
				>
					<Input
						id="email"
						type="email"
						required={true}
						label="Gib deine E-Mail-Adresse ein"
						disabled={loading}
					/>
					<button type="submit" class="btn btn-primary w-full" disabled={loading}>
						Abschicken
					</button>
				</form>
			</Modal>
			{#if form?.notVerified}
				<AlertError
					message="Du musst deine E-Mail-Adresse bestätigen, bevor du dich einloggen kannst!"
				/>
			{/if}
		</form>
	</div>
</div>
