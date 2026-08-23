<script lang="ts">
import { page } from '$app/state';
import { locale } from '$i18n/i18n-svelte';
import { siteConfig } from '$lib/config';

const lang = $derived((page.params.lang || $locale || 'id') as 'id' | 'en');
const isEn = $derived(lang === 'en');

let status = $derived(page.status || 404);
let is404 = $derived(status === 404);

const whatsappHref = $derived(
	`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
		isEn
			? 'Hello Rosantibike, I need help with motorcycle rental in Malang.'
			: 'Halo Rosantibike, saya butuh bantuan sewa motor di Malang.'
	)}`
);
</script>

<svelte:head>
	<title
		>{status} - {isEn ? 'Page Not Found' : 'Halaman Tidak Ditemukan'} | RosantiBike Motorent</title
	>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section
	class="min-h-[85vh] flex items-center justify-center pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 bg-[#f5f5f7]"
>
	<div class="max-w-3xl w-full mx-auto text-center">
		<h1
			class="text-4xl sm:text-6xl md:text-7xl font-bold text-[#1d1d1f] tracking-tight font-display mb-5 leading-[1.1]"
		>
			{is404
				? isEn
					? 'Destination Not Found.'
					: 'Halaman Tidak Ditemukan.'
				: isEn
					? 'Something Went Wrong.'
					: 'Terjadi Kendala.'}
		</h1>

		<p class="text-[#6e6e73] text-base sm:text-lg max-w-lg mx-auto font-sans leading-relaxed mb-10">
			{is404
				? isEn
					? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
					: 'Halaman yang Anda tuju mungkin telah dipindahkan, diperbarui, atau tautan yang Anda masukkan kurang tepat.'
				: isEn
					? 'Our system encountered an unexpected issue. Please try again shortly.'
					: 'Sistem kami mengalami kendala sementara. Silakan coba beberapa saat lagi.'}
		</p>

		<!-- Action Buttons matching Site Button Design -->
		<div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
			<a
				href="/{lang}"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-apple-blue hover:bg-[#0077ed] text-white text-sm font-semibold tracking-tight transition-all shadow-[0_2px_12px_rgba(0,113,227,0.25)] active:scale-[0.98]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
				<span>{isEn ? 'Back to Home' : 'Kembali ke Beranda'}</span>
			</a>

			<a
				href="/{lang}/fleet"
				class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#f0f0f2] text-[#1d1d1f] text-sm font-semibold tracking-tight transition-all border border-[#d2d2d7]/80 active:scale-[0.98]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="18.5" cy="17.5" r="3.5" />
					<circle cx="5.5" cy="17.5" r="3.5" />
					<circle cx="15" cy="5" r="1" />
					<path d="M12 17.5V14l-3-3 4-3 2 3h2" />
				</svg>
				<span>{isEn ? 'Explore Fleet' : 'Katalog Motor'}</span>
			</a>
		</div>

		<!-- Helpful Quick Links matching Site Style -->
		<div class="pt-8 border-t border-[#d2d2d7]/50 max-w-xl mx-auto">
			<div
				class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-[#6e6e73]"
			>
				<a href="/{lang}/booking" class="hover:text-apple-blue transition-colors">
					{isEn ? 'Online Booking' : 'Booking Motor'}
				</a>
				<span class="text-[#d2d2d7] select-none">&bull;</span>
				<a href="/{lang}/faq" class="hover:text-apple-blue transition-colors">
					{isEn ? 'Rental Terms' : 'Syarat & Ketentuan'}
				</a>
				<span class="text-[#d2d2d7] select-none">&bull;</span>
				<a href="/{lang}/blog" class="hover:text-apple-blue transition-colors">
					{isEn ? 'Travel Blog' : 'Blog Wisata'}
				</a>
				<span class="text-[#d2d2d7] select-none">&bull;</span>
				<a
					href={whatsappHref}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 text-[#0055a4] font-semibold hover:underline"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-[#34c759]"></span>
					<span>WhatsApp CS</span>
				</a>
			</div>
		</div>
	</div>
</section>
