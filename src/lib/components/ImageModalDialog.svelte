<script lang="ts">
	export let imageSrc: string;
	export let id: string;
</script>

<label for={`modal-${id}`}>
	<img alt="Modal des Bildes" class="thumbnail" src={imageSrc} />
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
