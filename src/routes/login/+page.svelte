<script lang="ts">
	import { CodeIcon } from 'svelte-feather-icons';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<CodeIcon class="text-primary h-24 w-24" />
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Logg dich ein
	</h2>
	<p class="text-center mt-1">
		Oder <a href="/register" class="text-primary font-medium hover:cursor-pointer"
			>registrier dich</a
		> falls du noch keinen Account hast.
	</p>
	<div class="bg-white py-6 shadow-md rounded-lg w-full max-w-sm mt-6">
		<form method="POST" action="?/login" class="flex flex-col items-center space-y-2 w-full">
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label font-medium pb-1">
					<span class="label-text">Email</span>
				</label>
				<input type="email" name="email" class="input input-bordered w-full max-w-xs" />
			</div>
			<div class="form-control w-full max-w-xs">
				<label for="password" class="label font-medium pb-1">
					<span class="label-text">Passwort</span>
				</label>
				<input type="password" name="password" class="input input-bordered w-full max-w-xs" />
			</div>
			<div class="w-full max-w-xs pt-3">
				<button class="btn btn-primary w-full max-w-xs">Login</button>
			</div>
			{#if form?.notVerified}
				<div class="alert alert-error shadow-lg">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span>Du musst deine EMailadresse bestätigen, bevor du dich einloggen kannst!</span>
					</div>
				</div>
			{/if}
		</form>
	</div>
</div>
