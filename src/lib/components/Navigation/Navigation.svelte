<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PBUser } from '$lib/types/user';
	import { UserRoles } from '$lib/types/userRoles';
	import { getImageURL } from '$lib/util';
	import { Accordion, AccordionItem, Avatar, getDrawerStore } from '@skeletonlabs/skeleton';

	export let user: PBUser | undefined;

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" class="!rounded-none">Home</a></li>

		{#if user}
			<li><a href="/gegenstand" on:click={drawerClose} class="!rounded-none">Gegenstände</a></li>
			<li><a href="/kiste" on:click={drawerClose} class="!rounded-none">Kisten</a></li>
			<li><a href="/lagerort" on:click={drawerClose} class="!rounded-none">Lagerorte</a></li>

			{#if user.role === UserRoles.INVENTARIST}
				<li><a href="/bestellung" on:click={drawerClose} class="!rounded-none">Bestellungen</a></li>
			{/if}
		{/if}

		<li><a href="/impressum" class="!rounded-none">Impressum</a></li>
		{#if user}
			<hr />
			<Accordion rounded="!rounded-none">
				<AccordionItem on:click={() => goto('/my/settings/profile')}>
					<svelte:fragment slot="lead">
						<Avatar
							src={getImageURL(user.collectionId, user.id, user.avatar, '48x48')}
							initials={user.username.slice(0, 2)}
							width="w-10"
							rounded="rounded-full"
							background="bg-primary"
						/>
					</svelte:fragment>
					<svelte:fragment slot="summary">Profil</svelte:fragment>
					<svelte:fragment slot="content">
						<ul tabindex="-1">
							<li>
								<a href="/my/settings/profile" on:click={drawerClose} class="!rounded-none">
									Profil
								</a>
							</li>
							<li>
								<a href="/my/settings/account" on:click={drawerClose} class="!rounded-none">
									Account
								</a>
							</li>
							<li>
								<a href="/my/settings/security" on:click={drawerClose} class="!rounded-none">
									Sicherheit
								</a>
							</li>
							<li>
								<form action="/logout" method="post">
									<button type="submit" on:click={drawerClose} class="!rounded-none w-full">
										Logout
									</button>
								</form>
							</li>
						</ul>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		{/if}
	</ul>
</nav>
