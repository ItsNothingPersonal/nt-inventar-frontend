<script lang="ts">
	import { BreakPoints } from '$lib/types/breakpoints';
	import { isNotNullOrUndefined } from '$lib/util';
	import Icon from '@iconify/svelte';

	export let disabled: boolean = false;
	export let form: string | undefined = undefined;
	export let type: 'submit' | 'button' | 'reset' | undefined = 'button';
	export let icon: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let onKeyDown: (() => void) | undefined = undefined;
	export let style: 'primary' | 'secondary' | 'tertiary' = 'primary';

	$: innerWidth = 0;
	$: buttonStyle =
		style === 'primary'
			? 'variant-filled-primary'
			: style === 'secondary'
			? 'variant-filled-secondary'
			: 'variant-filled-tertiary';
</script>

<svelte:window bind:innerWidth />
<button
	{type}
	{disabled}
	{form}
	class="btn {buttonStyle} rounded-none w-full max-w-md"
	on:click={onClick}
	on:keydown={isNotNullOrUndefined(onKeyDown) ? onKeyDown : onClick}
>
	{#if innerWidth <= BreakPoints.Large && isNotNullOrUndefined(icon)}
		<Icon {icon} />
	{:else}
		<slot />
	{/if}
</button>
