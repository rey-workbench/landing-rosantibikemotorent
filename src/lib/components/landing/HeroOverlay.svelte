<script>
	import { LL } from '$i18n/i18n-svelte';
	import { siteConfig } from '$lib/config';

	const whatsappHref = $derived(
		`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Halo, saya tertarik untuk menyewa motor.')}`
	);
</script>

<div
	class="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center text-center px-4 md:px-20 overflow-hidden pt-12"
>
	<div class="relative inline-block overflow-hidden py-2 sm:py-4">
		<h1
			class="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white tracking-tight leading-[1.05]"
		>
			<span class="block relative">
				<span class="text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/70">
					{$LL.hero_tagline_1()}
				</span>
			</span>
		</h1>

		<p
			class="mt-6 md:mt-8 text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide"
		>
			{$LL.hero_hook()}
		</p>
	</div>

	<div class="mt-8 flex flex-wrap gap-4 pointer-events-auto justify-center">
		<a
			href={whatsappHref}
			target="_blank"
			rel="noopener noreferrer"
			class="px-6 py-2.5 rounded-full bg-apple-blue hover:bg-[#0077ed] text-white font-medium text-base transition-colors"
		>
			{$LL.hero_rent_now()}
		</a>
		<a
			href="#fleet"
			class="px-6 py-2.5 rounded-full bg-transparent hover:bg-white/10 text-white font-medium text-base backdrop-blur-md transition-colors border border-white/20"
		>
			{$LL.hero_view_fleet()}
		</a>
	</div>

	<div class="mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4 pointer-events-auto"></div>
</div>
