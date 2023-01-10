<script lang="ts">
	import Image from './Image.svelte';

	export let imageSrc: string;
	export let id: string;
	export let thumbnailHeight = 48;
	export let thumbnailWidth = 48;

	let modalShown = false;
</script>

<label for={`modal-${id}`}>
	<Image
		src={`${imageSrc}?thumb=${thumbnailWidth}x${thumbnailHeight}`}
		alt="Thumbnail des Bildes"
		width={thumbnailWidth}
		imageName="thumbnail von {id}"
	/>
</label>

<input type="checkbox" id={`modal-${id}`} class="modal-toggle" bind:value={modalShown} />
<label for={`modal-${id}`} class="modal cursor-pointer" id={`label-${id}`}>
	<label class="modal-box relative" for="">
		{#if modalShown}
			<slot />
		{/if}
	</label>
</label>
