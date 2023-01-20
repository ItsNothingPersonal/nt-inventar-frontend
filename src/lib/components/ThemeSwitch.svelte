<script lang="ts">
	import { selectedTheme } from '$lib/storeClient';
	import { changeToTheme, toTitleCase } from '$lib/util';

	export let id: string;
	export let options: string[];
	export let preselected: string;
	export let value: string;

	const changeTheme = (theme: string) => {
		const didChange = changeToTheme($selectedTheme, theme);
		if (didChange) {
			selectedTheme.set(theme);
		}
	};
</script>

<div class="form-control w-full max-w-xs">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text">Theme</span>
	</label>
	<select
		{id}
		name={id}
		data-choose-theme
		class="select select-bordered w-full max-w-xs"
		value={value ?? preselected}
		on:change={(event) => changeTheme(event.currentTarget.value)}
	>
		{#each options as option}
			<option value={option}>{toTitleCase(option)}</option>
		{/each}
	</select>
</div>
