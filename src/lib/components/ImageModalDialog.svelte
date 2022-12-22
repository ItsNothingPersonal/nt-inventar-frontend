<script lang="ts">
	export let imageSrc: string;
</script>

<label for="my-modal-4">
	<img alt="Modal des Bildes" class="thumbnail" src={imageSrc} />
</label>

<input type="checkbox" id="my-modal-4" class="modal-toggle" />
<label for="my-modal-4" class="modal cursor-pointer">
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
