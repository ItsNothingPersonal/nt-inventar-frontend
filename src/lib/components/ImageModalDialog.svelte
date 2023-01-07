<script lang="ts">
	export let imageSrc: string;
	export let id: string;
	export let height = 48;
	export let width = 48;
</script>

<label for={`modal-${id}`}>
	<img alt="Thumbnail des Bildes" class="thumbnail" src={imageSrc} {height} {width} />
</label>

<input type="checkbox" id={`modal-${id}`} class="modal-toggle" />
<label for={`modal-${id}`} class="modal cursor-pointer" id={`label-${id}`}>
	<label class="modal-box relative" for="">
		<slot />
	</label>
</label>

<style lang="css">
	.thumbnail {
		width: 3rem;
		height: 3rem;
	}
</style>
