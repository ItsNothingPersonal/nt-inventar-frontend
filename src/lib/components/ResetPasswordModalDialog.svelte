<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ActionResult } from '@sveltejs/kit';
	import type { SvelteComponent } from 'svelte';

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	$: loading = false;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	const submitPasswortReset = () => {
		loading = true;

		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					modalStore.close();
					break;
				case 'error':
					break;
				default:
					//applyAction(result);
					modalStore.close();
					break;
			}
			loading = false;
		};
	};
</script>

{#if $modalStore[0]}
	<div class={cBase}>
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>

		<article>
			<form class={cForm} action="?/resetPassword" method="post" use:enhance={submitPasswortReset}>
				<label class="label">
					<span>E-Mail</span>
					<input
						class="input variant-form-material"
						name="email"
						type="email"
						placeholder="Gib deine E-Mailadresse ein..."
						disabled={loading}
					/>
				</label>
			</form>
		</article>

		<footer class="modal-footer {parent.regionFooter}">
			<button
				class="btn {parent.buttonNeutral} rounded-none"
				on:click={parent.onClose}
				disabled={loading}
			>
				{parent.buttonTextCancel}
			</button>
			<button class="btn {parent.buttonPositive} rounded-none" type="submit" disabled={loading}>
				Passwort zurücksetzen
			</button>
		</footer>
	</div>
{/if}
