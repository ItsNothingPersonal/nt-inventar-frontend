<script lang="ts">
	import { BreakPoints } from '$lib/types/breakpoints';
	import { isNotNullOrUndefined } from '$lib/util';

	export let label: string;
	export let disabled: boolean = false;
	export let icon: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let onKeyDown: (() => void) | undefined = undefined;
	export let asLink: boolean = false;

	$: innerWidth = 0;
	$: innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<span
	class={asLink
		? 'text-primary hover:cursor-pointer hover:underline'
		: `btn btn-primary ${innerWidth <= BreakPoints.Large ? 'btn-square' : ''} ${
				disabled ? `btn-disabled` : ''
		  }`}
	on:keydown={onKeyDown}
	on:click={onClick}
	role="button"
	tabindex="0"
>
	{#if innerWidth <= BreakPoints.Large && isNotNullOrUndefined(icon)}
		<iconify-icon {icon}></iconify-icon>
	{:else}
		{label}
	{/if}
</span>
