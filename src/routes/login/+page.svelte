<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { AlertError, Input, Modal, ModalTriggerButton } from '$lib/components';
	import { sessionStore } from '$lib/util';
	import type { ActionResult } from '@sveltejs/kit';
	import type { AuthProviderInfo } from 'pocketbase';
	import { CodeIcon } from 'svelte-feather-icons';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	const redirectUrl = `${$page.url.origin}/redirect`;

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

	function gotoAuthProvider(providerData: AuthProviderInfo) {
		if (browser && providerData) {
			const jsonProvider = JSON.stringify(providerData);
			document.cookie = `oauth=${jsonProvider}`;
			sessionStorage.removeItem('oauths');
			sessionStore('oauths', jsonProvider);
			const redirectURL = `${providerData.authUrl}${redirectUrl}`;
			window.location.href = redirectURL || '';
		}
	}

	function getProviderImageName(name: string = 'bitcoin') {
		if (name === 'discord') name = 'discord-alt';
		let imageProvider = `bxl:${name}`;
		if (name == 'kakao') imageProvider = `simple-icons:kakaotalk`;

		return imageProvider;
	}
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<CodeIcon class="text-primary h-24 w-24" />
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Logg dich ein
	</h2>
	<p class="text-center mt-1">
		Oder <a href="/register" class="text-primary font-medium hover:cursor-pointer">
			registrier dich
		</a> falls du noch keinen Account hast.
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
				<ModalTriggerButton slot="trigger" label="Ich habe mein Passwort vergessen" asLink={true} />
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
					title="Fehler beim Login"
					message="Du musst deine E-Mail-Adresse bestätigen, bevor du dich einloggen kannst!"
				/>
			{/if}
			{#if form?.success === false && form?.notVerified === false}
				<AlertError title="Fehler beim Login" message="Passwort oder E-Mail-Adresse ist falsch" />
			{/if}
		</form>
		<div class="divider mb-0" />
		<div class="card">
			<div class="card-body items-center text-center">
				<span class="text-sm font-black pb-4"> oder nutze einen der folgenden Logins... </span>

				<div class="card-actions justify-center text-center">
					{#each data.authProviders as p}
						<button class="btn btn-wide gap-2" on:click={() => gotoAuthProvider(p)}>
							<span class="justify-center">
								<img
									alt={p.name}
									src="https://api.iconify.design/{getProviderImageName(
										p.name
									)}.svg?color=%23888888"
								/>
							</span>
							<span>{p.name}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
