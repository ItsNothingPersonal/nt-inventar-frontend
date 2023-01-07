<script lang="ts">
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';

	export let imageName: string;
	export let imageCollection: string;
	export let itemId: string;
	export let label: string | undefined = undefined;
	export let alt: string | undefined = undefined;
	export let height = 512;
	export let width = 512;
</script>

<div class="form-control w-full max-w-lg mb-2">
	{#if label}
		<label for={`img-${imageName}`} class="label font-medium pb-1">
			<span class="label-text">{label}</span>
		</label>
	{/if}

	<img
		id={`img-${imageName}`}
		{alt}
		src={`${PUBLIC_PB_BASE_URL}/api/files/${imageCollection}/${itemId}/${imageName}`}
		{height}
		{width}
	/>
</div>
