<script lang="ts">
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import { editMode } from '$lib/storeClient';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { MenuSegment } from '$lib/types/menuSegment';
	import { UserRoles } from '$lib/types/userRoles';
	import { getImageURL, isNotNullOrUndefined, isNullOrUndefined } from '$lib/util';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: innerWidth = 0;
	$: innerHeight = 0;

	const toggleEditMode = () => {
		editMode.set(!$editMode);
	};

	let mobileMenuData: MenuSegment[] = [
		{
			categoryName: 'Inventar',
			entries: [
				{ label: 'Gegenstände', href: '/gegenstand', hidden: isNullOrUndefined(data.user) },
				{ label: 'Kisten', href: '/kiste', hidden: isNullOrUndefined(data.user) },
				{ label: 'Projekte', href: '/projekt', hidden: isNullOrUndefined(data.user) }
			]
		},
		{
			categoryName: 'Impressum',
			entries: { label: 'Impressum', href: '/impressum' }
		},
		{
			categoryName: 'Profile',
			entries: [
				{ label: 'Profil', href: '/my/settings/profile', hidden: isNullOrUndefined(data.user) },
				{ label: 'Account', href: '/my/settings/account', hidden: isNullOrUndefined(data.user) },
				{ label: 'Security', href: '/my/settings/security', hidden: isNullOrUndefined(data.user) },
				{ label: 'Login', href: '/login', hidden: isNotNullOrUndefined(data.user) },
				{ label: 'Logout', href: '/logout', hidden: isNullOrUndefined(data.user), type: 'Button' }
			]
		},
		{
			categoryName: 'Modus',
			entries: [
				{
					label: 'Edit-Modus',
					hidden: data.user?.role !== UserRoles.INVENTARIST,
					type: 'Input',
					onClick: toggleEditMode
				}
			]
		}
	];
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<main class="container mx-auto">
	<div class="navbar bg-base-100">
		<div class="flex flex-1">
			<a class="btn btn-ghost normal-case text-xl pl-0" href="/">
				Nächtliches Theater - Inventar
			</a>
		</div>
		<div class="flex-none">
			{#if innerWidth > BreakPoints.Large}
				<ul class="menu menu-horizontal px-1">
					{#if data.user?.role === UserRoles.INVENTARIST}
						<li>
							<div class="form-control">
								<label class={'label cursor-pointer'}>
									<span class="label-text pr-2">Bearbeiten</span>
									<input
										type="checkbox"
										class="toggle toggle-sm md:toggle-md toggle-warning"
										on:click={toggleEditMode}
									/>
								</label>
							</div>
						</li>
					{/if}
					{#if data.user}
						<li><a href="/gegenstand">Gegenstände</a></li>
						<li><a href="/kiste">Kisten</a></li>
						<li><a href="/projekt">Projekte</a></li>
					{/if}
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
										? getImageURL(data.user.collectionId, data.user.id, data.user.avatar, '40x40')
										: `https://ui-avatars.com/api/?name=${data.user?.name}`}
									height="40"
									width="40"
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
			{:else}
				<MobileMenu menuEntries={mobileMenuData} />
			{/if}
		</div>
	</div>
	<slot />
</main>
