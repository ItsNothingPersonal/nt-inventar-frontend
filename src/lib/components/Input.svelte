<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let id: string;
	export let label: string | undefined = undefined;
	export let type = 'text';
	export let disabled = false;
	export let required = false;
	export let hidden = false;
	export let cssClass = 'input input-bordered w-full max-w-lg';
	export let accept = '*';
	export let onChange: ((event: Event) => void) | undefined = undefined;
</script>

<div class="form-control w-full max-w-lg mb-2">
	{#if label}
		<label for={id} class="label font-medium pb-1">
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input
		{type}
		{placeholder}
		{required}
		{disabled}
		{id}
		name={id}
		{value}
		class={cssClass}
		{accept}
		{hidden}
		on:change={onChange}
	/>
</div>
