<script lang="ts">
	import { page } from '$app/stores';
	import { BreakPoints } from '$lib/types/breakpoints';

	$: innerWidth = 0;
	$: innerHeight = 0;

	const navigation = [
		{
			title: 'Profil',
			href: '/my/settings/profile'
		},
		{
			title: 'Account',
			href: '/my/settings/account'
		},
		{
			title: 'Sicherheit',
			href: '/my/settings/security'
		}
	];
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="w-full h-full px-2">
	<h3 class="text-2xl font-medium">Einstellungen</h3>
	<div class="divider" />
</div>

<div class="flex w-full h-full space-x-4">
	{#if innerWidth > BreakPoints.Large}
		<div>
			<ul class="menu bg-base-100 w-56 p-2 rounded-box">
				{#each navigation as navItem}
					<li>
						<a
							href={navItem.href}
							class="font-medium {$page.url.pathname === navItem.href ? 'active' : ''}"
						>
							{navItem.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<div class="w-full">
			<slot />
		</div>
	{:else}
		<div class="w-full h-full px-2">
			<slot />
		</div>
	{/if}
</div>
