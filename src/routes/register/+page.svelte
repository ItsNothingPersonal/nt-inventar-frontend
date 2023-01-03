<script lang="ts">
	import { CodeIcon } from 'svelte-feather-icons';
</script>

<div class="flex flex-col items-center h-full w-full pt-12">
	<CodeIcon class="h-24 w-24 text-primary" />
	<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
		Registrier deinen Account
	</h2>
	<p class="text-center mt-1">
		Oder <a href="/login" class="text-primary font-medium hover:cursor-pointer">log dich ein</a> falls
		du schon einen Account hast.
	</p>
	<div class="bg-white py-6 shadow-md rounded-lg w-full max-w-sm mt-6">
		<form method="POST" action="?/register" class="flex flex-col items-center space-y-2 w-full">
			<div class="form-control w-full max-w-xs">
				<label for="username" class="label font-medium pb-1">
					<span class="label-text">Benutzername</span>
				</label>
				<input type="text" name="username" class="input input-bordered w-full max-w-xs" />
			</div>
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
			<div class="form-control w-full max-w-xs">
				<label for="passwordConfirm" class="label font-medium pb-1">
					<span class="label-text">Passwort bestätigen</span>
				</label>
				<input
					type="password"
					name="passwordConfirm"
					class="input input-bordered w-full max-w-sm"
				/>
			</div>
			<div class="w-full max-w-xs pt-3">
				<button class="btn btn-primary w-full max-w-xs">Register</button>
			</div>
		</form>
	</div>
</div>
