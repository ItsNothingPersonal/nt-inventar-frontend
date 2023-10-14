<script lang="ts">
	export let title: string | undefined = undefined;
	export let message: string;
</script>

<div class="alert alert-error shadow-lg w-fit m-2">
	<div>
		<iconify-icon icon="mdi:alert"></iconify-icon>
		<div class="flex flex-col">
			{#if title}
				<b>{title}</b>
			{/if}

			<span>{message}</span>
		</div>
	</div>
</div>
