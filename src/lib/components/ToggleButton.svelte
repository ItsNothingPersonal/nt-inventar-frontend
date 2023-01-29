<script lang="ts">
	import type { ComponentType, SvelteComponentTyped } from 'svelte';

	export let id: string;
	export let toggled: boolean;
	export let isMobile: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
	export let labelNotToggled: {
		desktop: string;
		mobile?: ComponentType<SvelteComponentTyped>;
		form?: string;
	};
	export let labelToggled: {
		desktop: string;
		mobile?: ComponentType<SvelteComponentTyped>;
		form?: string;
	};
	export let disabled = false;
</script>

{#if toggled}
	<label class={'label cursor-pointer'}>
		<button
			class="btn {isMobile ? 'btn-square' : ''} {toggled ? 'btn-warning' : 'btn-primary'}"
			type="submit"
			form={labelToggled.form}
			id={`${id}-toggled`}
			on:click={onClick}
			{disabled}
		>
			{#if isMobile && labelToggled.mobile}
				<svelte:component this={labelToggled.mobile} />
			{:else}
				{labelToggled.desktop}
			{/if}
		</button>
	</label>
{:else}
	<label class={'label cursor-pointer'}>
		<button
			class="btn {isMobile ? 'btn-square' : ''} {toggled ? 'btn-warning' : 'btn-primary'}"
			type="submit"
			form={labelNotToggled.form}
			id={`${id}-not-toggled`}
			on:click={onClick}
			{disabled}
		>
			{#if isMobile && labelNotToggled.mobile}
				<svelte:component this={labelNotToggled.mobile} />
			{:else}
				{labelNotToggled.desktop}
			{/if}
		</button>
	</label>
{/if}
