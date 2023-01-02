<script lang="ts">
	import type { MenuSegment } from '$lib/types/menuSegment';
	import { MenuIcon } from 'svelte-feather-icons';

	export let menuEntries: MenuSegment[] = [] as MenuSegment[];
</script>

<div class="dropdown dropdown-bottom dropdown-end">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label tabindex="0" class="btn m-1">
		<MenuIcon class="text-secondary" />
	</label>
	<ul class="dropdown-content menu bg-base-100 w-56 p-2 rounded-box border-2">
		{#each menuEntries as menuEntry}
			<li class="menu-title">
				<span>{menuEntry.categoryName}</span>
			</li>
			{#if Array.isArray(menuEntry.entries)}
				{#each menuEntry.entries as menuLink}
					{#if menuLink.hidden !== true}
						{#if menuLink.type === 'Button'}
							<li class="p-0">
								<form action={menuLink.href} method="post">
									<button type="submit">{menuLink.label}</button>
								</form>
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
		{/each}
	</ul>
</div>
