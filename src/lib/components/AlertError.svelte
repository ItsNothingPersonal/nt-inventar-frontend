<script lang="ts">
	import { AlertCircleIcon } from 'svelte-feather-icons';

	export let message: string;
</script>

<div class="alert alert-error shadow-lg w-fit m-2">
	<div>
		<AlertCircleIcon />
		<span>{message}</span>
	</div>
</div>
