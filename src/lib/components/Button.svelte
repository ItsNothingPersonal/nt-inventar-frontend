<script lang="ts">
	import { BreakPoints } from '$lib/types/breakpoints';
	import { isNotNullOrUndefined } from '$lib/util';

	export let label: string;
	export let disabled: boolean = false;
	export let form: string | undefined = undefined;
	export let type: 'submit' | 'button' | 'reset' | undefined = 'button';
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let onKeyDown: (() => void) | undefined = undefined;
	export let isSecondary: boolean = false;
	export let fullWidth: boolean = false;

	$: innerWidth = 0;
	$: innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<button
	{type}
	class="btn {isSecondary ? 'btn-secondary' : 'btn-primary'} {fullWidth
		? 'w-full'
		: ''} {innerWidth <= BreakPoints.Large ? 'btn-square' : ''}"
	{disabled}
	{form}
	on:click={onClick}
	on:keydown={onKeyDown}
>
	{#if innerWidth <= BreakPoints.Large && isNotNullOrUndefined(icon)}
		<svelte:component this={icon} />
	{:else}
		{label}
	{/if}
</button>
