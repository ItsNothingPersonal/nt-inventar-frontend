<script lang="ts">
	export let id: string;
	export let checked: boolean;
</script>

<input type="checkbox" {id} class="modal-toggle" {checked} bind:value={checked} />
