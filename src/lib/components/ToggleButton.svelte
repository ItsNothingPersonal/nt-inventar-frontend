<script lang="ts">
	export let id: string;
	export let toggled: boolean;
	export let isMobile: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
	export let labelNotToggled: {
		desktop: string;
		mobile?: string;
		form?: string;
	};
	export let labelToggled: {
		desktop: string;
		mobile?: string;
		form?: string;
	};
	export let disabled = false;
	export let isSmall = false;
</script>

{#if toggled}
	<label class={'label cursor-pointer'}>
		<button
			class="btn {isMobile ? 'btn-square' : ''} {toggled ? 'btn-warning' : 'btn-primary'} {isSmall
				? 'btn-sm'
				: ''}"
			type="submit"
			form={labelToggled.form}
			id={`${id}-toggled`}
			on:click={onClick}
			{disabled}
		>
			{#if isMobile && labelToggled.mobile}
				<iconify-icon icon={labelNotToggled.mobile}></iconify-icon>
			{:else}
				{labelToggled.desktop}
			{/if}
		</button>
	</label>
{:else}
	<label class={'label cursor-pointer'}>
		<button
			class="btn {isMobile ? 'btn-square' : ''} {toggled ? 'btn-warning' : 'btn-primary'} {isSmall
				? 'btn-sm'
				: ''}"
			type="submit"
			form={labelNotToggled.form}
			id={`${id}-not-toggled`}
			on:click={onClick}
			{disabled}
		>
			{#if isMobile && labelNotToggled.mobile}
				<iconify-icon icon={labelNotToggled.mobile}></iconify-icon>
			{:else}
				{labelNotToggled.desktop}
			{/if}
		</button>
	</label>
{/if}
