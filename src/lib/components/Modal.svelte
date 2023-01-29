<script lang="ts">
	import Checkbox from './Checkbox.svelte';

	export let label: string;
	export let checked: boolean;
</script>

<label for={label}>
	<slot name="trigger" />
</label>

<Checkbox {checked} id={label} />
<div class="modal">
	<div class="modal-box relative">
		<label for={label} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<div class="font-bold text-xl text-center">
			<slot name="heading" />
		</div>
		<div class="my-2">
			<slot />
		</div>
		<div class="modal-action justify-center">
			<slot name="actions" />
		</div>
	</div>
</div>
