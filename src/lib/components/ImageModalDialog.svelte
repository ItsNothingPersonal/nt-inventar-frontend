<script lang="ts">
	import Image from './Image.svelte';

	export let imageSrc: string;
	export let id: string;
	export let thumbnailHeight = 48;
	export let thumbnailWidth = 48;

	let modalShown = false;
</script>

<label for={`modal-${id}`}>
	<div class="w-12">
		<Image
			src={`${imageSrc}?thumb=${thumbnailWidth}x${thumbnailHeight}`}
			alt="Thumbnail des Bildes"
			width={thumbnailWidth}
			height={thumbnailHeight}
			imageName="thumbnail von {id}"
			lazy={false}
		/>
	</div>
</label>

<input type="checkbox" id={`modal-${id}`} class="modal-toggle" bind:value={modalShown} />
<div class="modal cursor-pointer">
	<div class="modal-box relative">
		<label for={`modal-${id}`} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		{#if modalShown}
			<slot />
		{/if}
	</div>
</div>
