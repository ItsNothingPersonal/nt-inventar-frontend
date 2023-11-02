<script lang="ts">
	import { page } from '$app/stores';
	import { ImageModalDialog } from '$lib/components';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import ResetPasswordModalDialog from '$lib/components/ResetPasswordModalDialog.svelte';
	import {
		AppBar,
		AppShell,
		Drawer,
		LightSwitch,
		Modal,
		getDrawerStore,
		initializeStores,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import '../app.postcss';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: innerWidth = 0;
	$: innerHeight = 0;
	$: classesSidebar =
		$page.url.pathname === '/' ||
		$page.url.pathname === '/login' ||
		$page.url.pathname === '/register'
			? 'w-0'
			: 'w-0 lg:w-64';

	initializeStores();
	const drawerStore = getDrawerStore();

	const modalRegistry: Record<string, ModalComponent> = {
		imageModalDialog: { ref: ImageModalDialog },
		passwordResetModalDialog: { ref: ResetPasswordModalDialog }
	};

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<Modal components={modalRegistry} />
<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation user={data.user} />
</Drawer>
<AppShell slotSidebarLeft="bg-surface-500/5 {classesSidebar}" slotPageContent="px-2">
	<svelte:fragment slot="header">
		<AppBar class="print:hidden">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<a href="/">
						{#if innerWidth > 1024}
							<strong class="text-xl uppercase"> Nächtliches Theater - Inventar </strong>
						{:else}
							<strong class="text-xl uppercase"> NT - Inventar </strong>
						{/if}
					</a>
				</div>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation user={data.user} />
	</svelte:fragment>
	<slot />
</AppShell>
