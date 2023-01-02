<script lang="ts">
	import { UserRoles } from '$lib/types/userRoles';
	import { getImageURL } from '$lib/util';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<main class="container mx-auto">
	<div class="navbar bg-base-100">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-xl pl-0" href="/">Nächtliches Theater - Inventar</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				{#if data.user?.role === UserRoles.INVENTARIST}
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<li tabindex="0" class="z-10">
						<!-- svelte-ignore a11y-missing-attribute -->
						<a>
							Gegenstände
							<svg
								class="fill-current"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
							>
						</a>
						<ul class="p-2 bg-base-100 border-2">
							<li><a href="/gegenstand/uebersicht">Übersicht</a></li>
							<li><a href="/gegenstand/anlegen">Anlegen</a></li>
						</ul>
					</li>
				{:else}
					<li><a href="/gegenstand/uebersicht">Gegenstände</a></li>
				{/if}
				{#if data.user?.role === UserRoles.INVENTARIST}
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<li tabindex="0" class="z-10">
						<!-- svelte-ignore a11y-missing-attribute -->
						<a>
							Kisten
							<svg
								class="fill-current"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg
							>
						</a>
						<ul class="p-2 bg-base-100 border-2">
							<li><a href="/kiste/uebersicht">Übersicht</a></li>
							<li><a href="/kiste/anlegen">Anlegen</a></li>
						</ul>
					</li>
				{:else}
					<li><a href="/kiste/uebersicht">Kisten</a></li>
				{/if}
				<li><a href="/projekt/uebersicht">Projekte</a></li>
				<li><a href="/impressum">Impressum</a></li>
				{#if !data.user}
					<li><a href="/login" role="button" class="btn btn-primary">Login</a></li>
				{/if}
			</ul>
			{#if data.user}
				<div class="dropdown dropdown-end">
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label tabindex="0" class="btn btn-ghost btn-circle avatar">
						<div class="w-10 rounded-full">
							<img
								alt="Profilbild in Navbar"
								src={data.user?.avatar
									? getImageURL(data.user.collectionId, data.user.id, data.user.avatar)
									: `https://ui-avatars.com/api/?name=${data.user?.name}`}
							/>
						</div>
					</label>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 border-2"
					>
						<li><a href="/my/settings">Einstellungen</a></li>
						<li class="p-0">
							<form action="/logout" method="post">
								<button type="submit">Logout</button>
							</form>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>

	<slot />
</main>
