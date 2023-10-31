<script lang="ts">
	export let active: boolean;
	export let sortedAsc: boolean;
</script>

{#if active}
	<div class="flex items-center">
		{#if sortedAsc}
			<iconify-icon icon="mdi:chevron-down"></iconify-icon>
		{:else}
			<iconify-icon icon="mdi:chevron-up"></iconify-icon>
		{/if}
	</div>
{/if}
