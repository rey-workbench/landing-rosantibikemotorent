<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '$lib/config';
	import { locale } from '$i18n/i18n-svelte';

	const lang = $derived((page.params.lang || $locale || 'id') as 'id' | 'en');
	const isEn = $derived(lang === 'en');

	let status = $derived(page.status || 404);
	let message = $derived(
		page.status === 404
			? isEn
				? 'The page you are looking for does not exist or has been moved.'
				: 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.'
			: page.error?.message || (isEn ? 'An unexpected error occurred.' : 'Terjadi kesalahan pada sistem.')
	);

	const whatsappHref = $derived(
		`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
			isEn
				? 'Hello Rosantibike, I need assistance with motorbike rental.'
				: 'Halo Rosantibike, saya butuh bantuan sewa motor.'
		)}`
	);
</script>

<svelte:head>
	<title>{status} - {isEn ? 'Page Not Found' : 'Halaman Tidak Ditemukan'} | Rosantibike Motorent</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="min-h-[80vh] flex items-center justify-center px-6 pt-36 pb-24 md:pt-44 md:pb-32 text-center bg-[#f5f5f7]">
	<div class="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/[0.03] border border-black/5">
		<!-- Status Code Badge -->
		<div
			class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-50/80 text-apple-blue font-black text-3xl mb-6 shadow-xs"
		>
			{status}
		</div>

		<h1 class="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-3 font-display">
			{status === 404
				? isEn
					? 'Page Not Found'
					: 'Halaman Tidak Ditemukan'
				: isEn
					? 'System Error'
					: 'Terjadi Kesalahan'}
		</h1>

		<p class="text-[#6b6b70] text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
			{message}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a
				href="/{lang}"
				class="px-6 py-3 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-sm transition-all shadow-sm active:scale-95"
			>
				{isEn ? 'Back to Home' : 'Kembali ke Beranda'}
			</a>
			<a
				href="/{lang}/fleet"
				class="px-6 py-3 rounded-full bg-apple-blue hover:bg-[#0077ed] text-white font-medium text-sm transition-all shadow-sm active:scale-95"
			>
				{isEn ? 'View Fleet' : 'Lihat Armada Motor'}
			</a>
		</div>

		<div class="mt-8 pt-6 border-t border-black/5">
			<a
				href={whatsappHref}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 text-xs text-[#6b6b70] hover:text-apple-blue font-medium transition-colors"
			>
				<span>{isEn ? 'Need urgent help? Contact us via WhatsApp' : 'Butuh bantuan langsung? Hubungi kami via WhatsApp'}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	</div>
</section>
