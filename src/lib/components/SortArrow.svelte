<script lang="ts">
	import { ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';

	export let active: boolean;
	export let sortedAsc: boolean;
</script>

{#if active}
	<div class="w-16 h-16 flex items-center">
		{#if sortedAsc}
			<ChevronDownIcon />
		{:else}
			<ChevronUpIcon />
		{/if}
	</div>
{/if}
