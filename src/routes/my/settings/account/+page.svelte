<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Input, Modal, ModalTriggerButton } from '$lib/components';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;

	let emailModalOpen: boolean;
	let usernameModalOpen: boolean;
	let loading: boolean;

	$: emailModalOpen = false;
	$: usernameModalOpen = false;
	$: loading = false;

	const submitUpdateEMail = () => {
		loading = true;
		emailModalOpen = true;

		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					emailModalOpen = false;
					break;
				case 'error':
					break;
				default:
					applyAction(result);
					break;
			}
			loading = false;
		};
	};

	const submitUpdateUsername = () => {
		loading = true;
		usernameModalOpen = true;

		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					usernameModalOpen = false;
					break;
				case 'error':
					break;
				default:
					applyAction(result);
					break;
			}
			loading = false;
		};
	};
</script>

<div class="flex flex-col w-full h-full space-y-12">
	<div class="w-full">
		<h3 class="text-2xl font-medium">EMail ändern</h3>
		<div class="divider" />
		<Modal label="change-email" checked={emailModalOpen}>
			<ModalTriggerButton slot="trigger" label="E-Mail-Adresse ändern" />
			<h3 slot="heading">Ändere deine E-Mail-Adresse</h3>
			<form action="?/updateEMail" method="post" class="space-y-2" use:enhance={submitUpdateEMail}>
				<Input
					id="email"
					type="email"
					required={true}
					value={form?.data.email}
					label="Gib deine neue E-Mail-Adresse ein"
					disabled={loading}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}>
					Ändere meine E-Mail-Adresse
				</button>
			</form>
		</Modal>
	</div>
	<div class="w-full">
		<h3 class="text-2xl font-medium">Benutzernamen ändern</h3>
		<div class="divider mb-0.5" />
		<Input id="username" label="Username" value={data?.user?.username} disabled />
		<Modal label="change-username" checked={usernameModalOpen}>
			<ModalTriggerButton slot="trigger" label="Benutzernamen ändern" />
			<h3 slot="heading">Ändere deinen Benutzernamen</h3>
			<form
				action="?/updateUsername"
				method="post"
				class="space-y-2"
				use:enhance={submitUpdateUsername}
			>
				<Input
					id="username"
					type="text"
					required={true}
					value={form?.data.username}
					label="Gib deinen neuen Benutzernamen ein"
					disabled={loading}
				/>
				<button type="submit" class="btn btn-primary w-full" disabled={loading}>
					Ändere meinen Benutzernamen
				</button>
			</form>
		</Modal>
	</div>
</div>
