<script lang="ts">
	import { ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';

	export let active: boolean;
	export let sortedAsc: boolean;
</script>

{#if active}
	<div class="flex items-center">
		{#if sortedAsc}
			<ChevronDownIcon />
		{:else}
			<ChevronUpIcon />
		{/if}
	</div>
{/if}
