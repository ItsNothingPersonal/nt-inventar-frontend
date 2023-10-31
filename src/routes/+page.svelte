<script lang="ts">
	import logo from '$lib/assets/Logo_NT.webp';
</script>

<div class="container mx-auto p-2 text-center">
	<div class="flex flex-col items-center gap-y-4">
		<img
			src={logo}
			width="384"
			height="238"
			alt="Logo des Nächtlichen Theaters"
			class="rounded-lg shadow-2xl pb-4 md:pb-0"
		/>
		<div>
			<h1 class="text-5xl font-bold">Inventar des Nächtlichen Theaters</h1>
			<p class="py-6">
				Willkommen beim Inventar des <a
					href="https://www.naechtlichestheater.de"
					class="text-primary hover:cursor-point hover:underline"
				>
					Nächtlichen Theater e.V.
				</a>! Angemeldete Benutzer erhalten hier einen Überblick über das Inventar des Vereins und
				seiner Projekte.
			</p>
			<a href="/login" role="button" class="btn variant-filled-primary rounded-none"> Login </a>
			<a href="/register" role="button" class="btn variant-filled-secondary rounded-none">
				Registrieren
			</a>
		</div>
	</div>
</div>
