<script lang="ts">
	import { Input } from '$lib/components';
	import Button from '$lib/components/Button/Button.svelte';
</script>

<h3 class="text-2xl font-medium">Passwort ändern</h3>
<hr class="mb-2" />

<form action="?/updatePassword" method="post">
	<Input id="oldPassword" label="Altes Passwort" type="password" required />
	<Input id="password" label="Neues Passwort" type="password" required />
	<Input id="passwordConfirm" label="Passwort bestätigen" type="password" required />

	<div class="w-full max-w-lg pt-3">
		<Button type="submit">Passwort aktualisieren</Button>
	</div>

	<a href="/reset-password" class="underline decoration-dotted mt-4">
		Ich habe mein Passwort vergessen
	</a>
</form>
