<script lang="ts">
	import { Label } from '$lib/constants';
	import { editMode } from '$lib/storeClient';
	import type { MenuSegment } from '$lib/types/menuSegment';
	import type { PBUser } from '$lib/types/user';
	import { UserRoles } from '$lib/types/userRoles';
	import { MenuIcon } from 'svelte-feather-icons';
	import ToggleButton from './ToggleButton.svelte';

	export let menuEntries: MenuSegment[] = [] as MenuSegment[];
	export let user: PBUser | undefined;
</script>

<div class="dropdown dropdown-bottom dropdown-end">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label tabindex="0" class="btn m-1">
		<MenuIcon class="text-secondary" />
	</label>
	<ul class="dropdown-content menu bg-base-100 w-56 p-2 rounded-box border-2">
		<li class="menu-title">
			<span>Modus</span>
		</li>
		<li>
			<ToggleButton
				id="mobile-edit-mode"
				labelNotToggled={{
					desktop:
						user?.role === UserRoles.INVENTARIST
							? Label.INTERACTIVE_MODE_BEARBEITEN
							: Label.INTERACTIVE_MODE_BESTELLEN
				}}
				labelToggled={{
					desktop:
						user?.role === UserRoles.INVENTARIST
							? Label.INTERACTIVE_MODE_BEARBEITEN
							: Label.INTERACTIVE_MODE_BESTELLEN
				}}
				toggled={$editMode}
				onClick={() => editMode.set(!$editMode)}
			/>
		</li>
		{#each menuEntries as menuEntry}
			{#if (Array.isArray(menuEntry.entries) && menuEntry.entries.filter((z) => z.hidden === false || z.hidden === undefined).length > 0) || (!Array.isArray(menuEntry.entries) && (menuEntry.entries.hidden === false || menuEntry.entries.hidden === undefined))}
				<li class="menu-title">
					<span>{menuEntry.categoryName}</span>
				</li>
				{#if Array.isArray(menuEntry.entries)}
					{#each menuEntry.entries as menuLink}
						{#if menuLink.hidden !== true}
							{#if menuLink.type === 'Button'}
								<li>
									<form action={menuLink.href} method="post">
										<button type="submit">{menuLink.label}</button>
									</form>
								</li>
							{:else if menuLink.type === 'Input'}
								<li>
									<div class="form-control">
										<label class={'label cursor-pointer'}>
											<span class="label-text pr-2">{menuLink.label}</span>
											<input type="Input" class={menuLink.cssClass} on:click={menuLink.onClick} />
										</label>
									</div>
								</li>
							{:else}
								<li>
									<a href={menuLink.href}>
										{menuLink.label}
									</a>
								</li>
							{/if}
						{/if}
					{/each}
				{:else}
					<li>
						<a href={menuEntry.entries.href}>
							{menuEntry.entries.label}
						</a>
					</li>
				{/if}
			{/if}
		{/each}
	</ul>
</div>
