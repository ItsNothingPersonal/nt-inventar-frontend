<script lang="ts">
	export let id: string;
	export let label: string;
	export let onClick: () => void;
	export let checked: boolean;
</script>

<div class="form-control">
	<label class={'label cursor-pointer'}>
		<span class="label-text pr-2">{label}</span>
		<input
			{id}
			type="checkbox"
			class="toggle toggle-sm md:toggle-md toggle-warning"
			on:click={onClick}
			{checked}
		/>
	</label>
</div>
