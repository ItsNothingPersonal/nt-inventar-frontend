<script lang="ts">
	import { Input } from '$lib/components';
</script>

<div class="flex flex-col w-full h-full">
	<div class="w-full">
		<form action="?/updatePassword" method="post" class="flex flex-col space-y-2 w-full">
			<div class="w-full">
				<h3 class="text-2xl font-medium"><h3 class="text-2xl">Passwort ändern</h3></h3>
				<div class="divider" />
			</div>
			<Input id="oldPassword" label="Altes Passwort" type="password" required />
			<Input id="password" label="Neues Passwort" type="password" required />
			<Input id="passwordConfirm" label="Passwort bestätigen" type="password" required />
			<a href="/reset-password" class="text-primary hover:cursor-point hover:underline">
				Ich habe mein Passwort vergessen
			</a>
			<div class="w-full max-w-lg pt-3">
				<button type="submit" class="btn btn-primary w-full max-w-lg">
					Passwort aktualisieren
				</button>
			</div>
		</form>
	</div>
</div>
