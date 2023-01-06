<script lang="ts">
	export let id: string;
	export let label: string | undefined = undefined;
	export let disabled = false;
	export let required = false;
	export let cssClass = 'select select-bordered w-full max-w-xs';
	export let options: string[] = [];
	export let value: string = options.length > 0 ? options[0] : '';
</script>

<div class="form-control w-full max-w-xs">
	{#if label}
		<label for={id} class="label font-medium pb-1">
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<select class={cssClass} {id} name={id} {required} {disabled} {value}>
		{#each options as option}
			<option>{option}</option>
		{/each}
	</select>
</div>
