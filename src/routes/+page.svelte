<script lang="ts">
	import logo from '$lib/assets/Logo_NT.webp';
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content flex-col lg:flex-row">
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
					href="https://naechtlichestheater.de"
					class="text-primary hover:cursor-point hover:underline"
				>
					Nächtlichen Theater e.V.
				</a>! Angemeldete Benutzer erhalten hier einen Überblick über das Inventar des Vereins und
				seiner Projekte.
			</p>
			<a href="/login" role="button" class="btn btn-primary"> Login </a>
			<a href="/register" role="button" class="btn btn-secondary"> Registrieren </a>
		</div>
	</div>
</div>
