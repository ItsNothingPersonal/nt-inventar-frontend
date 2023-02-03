<script lang="ts">
	import { ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';

	export let active: boolean;
	export let sortedAsc: boolean;
</script>

{#if active}
	{#if sortedAsc}
		<ChevronDownIcon />
	{:else}
		<ChevronUpIcon />
	{/if}
{/if}
