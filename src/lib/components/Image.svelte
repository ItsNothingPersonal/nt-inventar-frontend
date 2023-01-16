<script lang="ts">
	import { PUBLIC_PB_BASE_URL } from '$env/static/public';
	import { LazyImage } from 'svelte-lazy-image';

	export let imageName: string | undefined = undefined;
	export let imageCollection: string | undefined = undefined;
	export let itemId: string | undefined = undefined;
	export let src: string | undefined = undefined;
	export let label: string | undefined = undefined;
	export let alt: string | undefined = undefined;
	export let height = 512;
	export let width = 512;
	export let lazy = true;
</script>

<div class="form-control w-full max-w-lg mb-2">
	{#if label}
		<label for={`img-${imageName}`} class="label font-medium pb-1">
			<span class="label-text">{label}</span>
		</label>
	{/if}

	{#if lazy}
		<LazyImage
			id={`img-${imageName}`}
			src={src ? src : `${PUBLIC_PB_BASE_URL}/api/files/${imageCollection}/${itemId}/${imageName}`}
			placeholder="https://via.placeholder.com/{width}?text=lade%20Bild"
			alt={alt ?? ''}
			sizes="(max-width: {width}px) {width}px, {width}px"
			{height}
			{width}
		/>
	{:else}
		<img
			id={`img-${imageName}`}
			src={src ? src : `${PUBLIC_PB_BASE_URL}/api/files/${imageCollection}/${itemId}/${imageName}`}
			placeholder="https://via.placeholder.com/{width}?text=lade%20Bild"
			alt={alt ?? ''}
			sizes="(max-width: {width}px) {width}px, {width}px"
			{height}
			{width}
		/>
	{/if}
</div>
