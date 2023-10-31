<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { sessionStore } from '$lib/util';
	import Icon from '@iconify/svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { AuthProviderInfo } from 'pocketbase';
	import type { PageData } from './$types';

	export let data: PageData;

	const redirectUrl = `${$page.url.origin}/redirect`;
	const modalStore = getModalStore();

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

	function modalPasswortReset(): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'passwordResetModalDialog',
			title: 'Passwort zurücksetzen'
		};
		modalStore.trigger(modal);
	}
</script>

<div class="flex justify-center">
	<div class="card max-w-sm mt-12">
		<header class="card-header flex flex-col items-center">
			<Icon icon="material-symbols:code" width={36} height={36} />
			<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
				Logge dich ein
			</h2>
			<p class="text-center mt-1">
				Oder <a
					href="/register"
					class="font-medium hover:cursor-pointer underline decoration-dotted"
				>
					registrier dich
				</a> falls du noch keinen Account hast.
			</p>
		</header>
		<section class="p-4 flex flex-col items-center">
			<form method="POST" action="?/login" class="flex flex-col items-center space-y-2 w-full">
				<div class="form-control w-full max-w-xs">
					<label for="email" class="label font-medium pb-1">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						name="email"
						class="input input-bordered variant-form-material w-full max-w-xs"
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label for="password" class="label font-medium pb-1">
						<span class="label-text">Passwort</span>
					</label>
					<input
						type="password"
						name="password"
						class="input input-bordered variant-form-material w-full max-w-xs"
					/>
				</div>
				<div class="w-full max-w-xs pt-3">
					<button class="btn variant-filled-primary rounded-none w-full max-w-xs" type="submit">
						Login
					</button>
				</div>
			</form>
			<div class="w-full max-w-xs pt-3">
				<button
					class="btn variant-filled-secondary rounded-none w-full max-w-xs"
					on:click={() => modalPasswortReset()}
				>
					Passwort vergessen
				</button>
			</div>
		</section>
		{#if data.authProviders.length > 0}
			<footer class="card-footer">
				<div class="items-center text-center">
					<span class="text-sm font-black pb-4"> oder nutze einen der folgenden Logins... </span>

					<div class="justify-center text-center">
						{#each data.authProviders as p}
							<button type="button" class="btn variant-filled" on:click={() => gotoAuthProvider(p)}>
								<span>
									<img
										alt={p.name}
										src="https://api.iconify.design/{getProviderImageName(
											p.name
										)}.svg?color=%23888888"
									/>
								</span>
								<span>
									{p.name}
								</span>
							</button>
						{/each}
					</div>
				</div>
			</footer>
		{/if}
	</div>
</div>
