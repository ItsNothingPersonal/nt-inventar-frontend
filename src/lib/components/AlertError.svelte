<script lang="ts">
	import { AlertCircleIcon } from 'svelte-feather-icons';

	export let title: string | undefined = undefined;
	export let message: string;
</script>

<div class="alert alert-error shadow-lg w-fit m-2">
	<div>
		<AlertCircleIcon />
		<div class="flex flex-col">
			{#if title}
				<b>{title}</b>
			{/if}

			<span>{message}</span>
		</div>
	</div>
</div>
