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
				? 'Looks like you took a detour. The page you are looking for does not exist or has been relocated.'
				: 'Sepertinya Anda keluar dari jalur rute. Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.'
			: page.error?.message ||
					(isEn
						? 'An unexpected server error occurred.'
						: 'Terjadi kendala teknis pada sistem kami.')
	);

	const whatsappHref = $derived(
		`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
			isEn
				? 'Hello Rosantibike, I encountered a missing page and need assistance.'
				: 'Halo Rosantibike, saya butuh bantuan sewa motor di Malang.'
		)}`
	);
</script>

<svelte:head>
	<title>{status} - {isEn ? 'Page Not Found' : 'Rute Tidak Ditemukan'} | Rosantibike Motorent</title
	>
	<meta name="description" content={message} />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section
	class="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-32 pb-20 md:pt-40 md:pb-28 bg-[#f5f5f7] relative overflow-hidden"
>
	<!-- Background subtle decorative glow -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-apple-blue/5 rounded-full blur-3xl pointer-events-none"
	></div>

	<div
		class="max-w-xl w-full bg-white rounded-3xl md:rounded-[2.5rem] p-8 sm:p-12 md:p-14 shadow-[0_4px_40px_rgba(0,0,0,0.04)] border border-black/5 text-center relative z-10"
	>
		<!-- Status Code Tag -->
		<div
			class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f5f7] border border-black/5 text-xs font-semibold tracking-wider text-[#1d1d1f] mb-8"
		>
			<span
				class="w-2 h-2 rounded-full {status === 404 ? 'bg-amber-500' : 'bg-red-500'} animate-pulse"
			></span>
			<span
				>{status} &bull; {status === 404
					? isEn
						? 'PAGE NOT FOUND'
						: 'RUTE TERPUTUS'
					: isEn
						? 'SERVER ERROR'
						: 'KENDALA SISTEM'}</span
			>
		</div>

		<!-- Big Typography -->
		<h1 class="text-3xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-[1.1] mb-4">
			{status === 404
				? isEn
					? 'Lost Your Way?'
					: 'Jalur Tidak Ditemukan.'
				: isEn
					? 'Something Went Wrong.'
					: 'Terjadi Kendala.'}
		</h1>

		<p class="text-[#6b6b70] text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto">
			{message}
		</p>

		<!-- Primary & Secondary Buttons -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-10">
			<a
				href="/{lang}"
				class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-[13px] font-semibold transition-all shadow-sm active:scale-98"
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
				class="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[13px] font-semibold transition-all border border-black/5 active:scale-98"
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
				<span>{isEn ? 'Explore Fleet' : 'Katalog Armada'}</span>
			</a>
		</div>

		<!-- Quick Navigation Grid -->
		<div class="pt-8 border-t border-black/5 text-left">
			<p class="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] mb-4 text-center">
				{isEn ? 'Helpful Destinations' : 'Pilihan Halaman Lainnya'}
			</p>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
				<a
					href="/{lang}/booking"
					class="p-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors flex flex-col group border border-transparent hover:border-black/5"
				>
					<span
						class="text-xs font-semibold text-[#1d1d1f] group-hover:text-apple-blue transition-colors"
						>Booking Online</span
					>
					<span class="text-[11px] text-[#86868b]"
						>{isEn ? 'Direct reservation' : 'Pesan unit cepat'}</span
					>
				</a>
				<a
					href="/{lang}/faq"
					class="p-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors flex flex-col group border border-transparent hover:border-black/5"
				>
					<span
						class="text-xs font-semibold text-[#1d1d1f] group-hover:text-apple-blue transition-colors"
						>FAQ & Bantuan</span
					>
					<span class="text-[11px] text-[#86868b]"
						>{isEn ? 'Questions & rules' : 'Syarat & tarif'}</span
					>
				</a>
				<a
					href="/{lang}/blog"
					class="p-3 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors flex flex-col group border border-transparent hover:border-black/5 col-span-2 sm:col-span-1"
				>
					<span
						class="text-xs font-semibold text-[#1d1d1f] group-hover:text-apple-blue transition-colors"
						>Blog Wisata</span
					>
					<span class="text-[11px] text-[#86868b]">{isEn ? 'Malang & Bromo' : 'Tips & rute'}</span>
				</a>
			</div>
		</div>

		<!-- WhatsApp Direct Help -->
		<div class="mt-6 pt-4 text-center">
			<a
				href={whatsappHref}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-xs font-medium text-[#6b6b70] hover:text-[#1d1d1f] transition-colors"
			>
				<span class="w-2 h-2 rounded-full bg-[#25D366]"></span>
				<span
					>{isEn
						? 'Need immediate support? Chat Customer Service on WhatsApp'
						: 'Butuh bantuan segera? Chat CS Rosantibike via WhatsApp'}</span
				>
				&rarr;
			</a>
		</div>
	</div>
</section>
