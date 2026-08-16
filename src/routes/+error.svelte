<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '$lib/config';

	let status = $derived(page.status || 404);
	let message = $derived(
		page.status === 404
			? 'Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.'
			: page.error?.message || 'Terjadi kesalahan pada sistem.'
	);

	const whatsappHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Halo Rosantibike, saya butuh bantuan sewa motor.')}`;
</script>

<svelte:head>
	<title>{status} - Halaman Tidak Ditemukan | Rosantibike Motorent</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6 py-24 text-center">
	<div class="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
		<div
			class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-[#0071e3] font-bold text-2xl mb-6 shadow-inner"
		>
			{status}
		</div>

		<h1 class="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight mb-3">
			{status === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan'}
		</h1>

		<p class="text-[#6b6b70] text-sm sm:text-base leading-relaxed mb-8">
			{message}
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a
				href="/"
				class="px-6 py-3 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-sm transition-colors shadow-sm"
			>
				Kembali ke Beranda
			</a>
			<a
				href="/id/fleet"
				class="px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-sm transition-colors shadow-sm"
			>
				Lihat Armada Motor
			</a>
		</div>

		<div class="mt-6 pt-6 border-t border-black/5">
			<a
				href={whatsappHref}
				target="_blank"
				rel="noopener noreferrer"
				class="text-xs text-[#6b6b70] hover:text-[#0071e3] transition-colors"
			>
				Butuh bantuan langsung? Hubungi kami via WhatsApp &rarr;
			</a>
		</div>
	</div>
</div>
