<script lang="ts">
	import { Image, MobileMenu, ToggleButton } from '$lib/components';
	import { Label } from '$lib/constants';
	import { editMode, selectedTheme } from '$lib/storeClient';
	import { BreakPoints } from '$lib/types/breakpoints';
	import type { MenuSegment } from '$lib/types/menuSegment';
	import { UserRoles } from '$lib/types/userRoles';
	import { changeToTheme, getImageURL, isNotNullOrUndefined, isNullOrUndefined } from '$lib/util';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	onMount(() => {
		selectedTheme.set(data.user?.theme ?? 'dark');
		changeToTheme('', $selectedTheme);
	});

	$: innerWidth = 0;
	$: innerHeight = 0;

	let mobileMenuData: MenuSegment[] = [
		{
			categoryName: 'Inventar',
			entries: [
				{ label: 'Gegenstände', href: '/gegenstand', hidden: isNullOrUndefined(data.user) },
				{ label: 'Kisten', href: '/kiste', hidden: isNullOrUndefined(data.user) },
				{ label: 'Lagerorte', href: '/lagerort', hidden: isNullOrUndefined(data.user) },
				{
					label: 'Bestellungen',
					href: '/bestellung',
					hidden: isNullOrUndefined(data.user) || data.user.role !== UserRoles.INVENTARIST
				}
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
		}
	];
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<main class="container mx-auto print:p-0">
	<div class="navbar bg-base-100 print:hidden">
		<div class="flex flex-1">
			<a class="btn btn-ghost normal-case text-xl pl-0" href="/">
				Nächtliches Theater - Inventar
			</a>
		</div>
		<div class="flex-none">
			{#if innerWidth > BreakPoints.Large}
				<ul class="menu menu-horizontal px-1">
					{#if isNotNullOrUndefined(data.user)}
						<li>
							<ToggleButton
								id="desktop-edit-mode"
								labelNotToggled={{ desktop: Label.INTERACTIVE_MODE }}
								labelToggled={{ desktop: Label.INTERACTIVE_MODE }}
								onClick={() => editMode.set(!$editMode)}
								toggled={$editMode}
							/>
						</li>
					{/if}
					{#if data.user}
						<li><a href="/gegenstand">Gegenstände</a></li>
						<li><a href="/kiste">Kisten</a></li>
						<li><a href="/lagerort">Lagerorte</a></li>
					{/if}
					{#if data.user?.role === UserRoles.INVENTARIST}
						<li><a href="/bestellung">Bestellungen</a></li>
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
							<div class="rounded-full">
								<Image
									imageName="profilbild"
									src={data.user?.avatar
										? getImageURL(data.user.collectionId, data.user.id, data.user.avatar, '48x48')
										: `https://ui-avatars.com/api/?name=${data.user?.name}`}
									alt="Profilbild in Navbar"
									height={48}
									width={48}
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
