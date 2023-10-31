<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<div class="flex justify-center">
	<div class="card max-w-sm mt-12">
		<header class="card-header flex flex-col items-center">
			<Icon icon="material-symbols:code" width={36} height={36} />
			<h2 class="mt-2 text-center text-3xl font-bold tracking-tight text-base-content">
				Registrier deinen Account
			</h2>
			<p class="text-center mt-1">
				Oder <a href="/login" class="font-medium hover:cursor-pointer underline decoration-dotted"
					>log dich ein</a
				>
				falls du schon einen Account hast.
			</p>
		</header>
		<section class="p-4 flex flex-col items-center">
			<form method="POST" action="?/register" class="flex flex-col items-center space-y-2 w-full">
				<div class="form-control w-full max-w-xs">
					<label for="username" class="label font-medium pb-1">
						<span class="label-text">Benutzername</span>
					</label>
					<input
						type="text"
						name="username"
						class="input input-bordered w-full max-w-xs variant-form-material"
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label for="email" class="label font-medium pb-1">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						name="email"
						class="input input-bordered w-full max-w-xs variant-form-material"
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label for="password" class="label font-medium pb-1">
						<span class="label-text">Passwort</span>
					</label>
					<input
						type="password"
						name="password"
						class="input input-bordered w-full max-w-xs variant-form-material"
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label for="passwordConfirm" class="label font-medium pb-1">
						<span class="label-text">Passwort bestätigen</span>
					</label>
					<input
						type="password"
						name="passwordConfirm"
						class="input input-bordered w-full max-w-sm variant-form-material"
					/>
				</div>

				<div class="w-full max-w-xs pt-3">
					<button class="btn variant-filled-primary rounded-none w-full max-w-xs" type="submit">
						Registrieren
					</button>
				</div>
			</form>
		</section>
	</div>
</div>
