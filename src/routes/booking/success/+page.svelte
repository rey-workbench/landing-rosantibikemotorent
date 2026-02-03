<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { transaksiApi } from '$lib/api';
	import type { Transaksi } from '$lib/types';

	let transaksi: Transaksi | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		const id = $page.url.searchParams.get('id');
		if (id) {
			try {
				transaksi = await transaksiApi.getById(id);
			} catch (err) {
				error = err instanceof Error ? err.message : 'Gagal memuat data booking';
			}
		} else {
			error = 'ID booking tidak ditemukan';
		}
		loading = false;
	});

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Booking Berhasil - Rosantibike Motorent</title>
</svelte:head>

<div class="min-h-screen bg-brand-dark text-white">
	<Navbar />

	<section class="pt-32 pb-20 px-4 md:px-10">
		<div class="max-w-2xl mx-auto text-center">
			{#if loading}
				<div class="py-20">
					<div
						class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
					></div>
					<p class="text-gray-400">Memuat data booking...</p>
				</div>
			{:else if error}
				<div class="bg-red-500/20 border border-red-500/30 rounded-3xl p-12">
					<div class="text-6xl mb-4">⚠️</div>
					<h3 class="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
					<p class="text-gray-300">{error}</p>
					<a
						href="/booking"
						class="inline-block mt-6 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
					>
						Kembali ke Booking
					</a>
				</div>
			{:else}
				<!-- Success Header -->
				<div class="mb-12">
					<div
						class="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="text-green-400"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
					<h1 class="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
						Booking Berhasil!
					</h1>
					<p class="text-gray-400 text-lg">
						Terima kasih telah memilih Rosantibike Motorent. Kami akan segera menghubungi Anda via
						WhatsApp untuk konfirmasi.
					</p>
				</div>

				{#if transaksi}
					<!-- Booking Details -->
					<div class="bg-white/5 border border-white/10 rounded-3xl p-8 text-left mb-8">
						<h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="text-blue-400"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
								<polyline points="14 2 14 8 20 8" />
								<line x1="16" y1="13" x2="8" y2="13" />
								<line x1="16" y1="17" x2="8" y2="17" />
								<polyline points="10 9 9 9 8 9" />
							</svg>
							Detail Booking
						</h3>

						<div class="space-y-4">
							<div class="flex justify-between py-3 border-b border-white/10">
								<span class="text-gray-400">Nama Penyewa</span>
								<span class="text-white font-medium">{transaksi.namaPenyewa}</span>
							</div>
							<div class="flex justify-between py-3 border-b border-white/10">
								<span class="text-gray-400">No. WhatsApp</span>
								<span class="text-white font-medium">{transaksi.noWhatsapp}</span>
							</div>
							<div class="flex justify-between py-3 border-b border-white/10">
								<span class="text-gray-400">Tanggal Mulai</span>
								<span class="text-white font-medium"
									>{formatDate(transaksi.tanggalMulai)} • {transaksi.jamMulai}</span
								>
							</div>
							<div class="flex justify-between py-3 border-b border-white/10">
								<span class="text-gray-400">Tanggal Selesai</span>
								<span class="text-white font-medium"
									>{formatDate(transaksi.tanggalSelesai)} • {transaksi.jamSelesai}</span
								>
							</div>
							{#if transaksi.jasHujan > 0}
								<div class="flex justify-between py-3 border-b border-white/10">
									<span class="text-gray-400">Jas Hujan</span>
									<span class="text-white font-medium">{transaksi.jasHujan} buah</span>
								</div>
							{/if}
							{#if transaksi.helm > 0}
								<div class="flex justify-between py-3 border-b border-white/10">
									<span class="text-gray-400">Helm Tambahan</span>
									<span class="text-white font-medium">{transaksi.helm} buah</span>
								</div>
							{/if}
							<div class="flex justify-between py-3">
								<span class="text-gray-400">Total Biaya</span>
								<span class="text-2xl font-bold text-white"
									>{formatPrice(transaksi.totalBiaya)}</span
								>
							</div>
						</div>
					</div>

					<!-- Status Badge -->
					<div class="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8">
						<div class="flex items-center justify-center gap-3">
							<div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
							<span class="text-yellow-400 font-medium uppercase tracking-wider">
								Status: {transaksi.status}
							</span>
						</div>
						<p class="text-gray-400 text-sm mt-2">Menunggu konfirmasi dari tim kami</p>
					</div>
				{/if}

				<!-- WhatsApp CTA -->
				<a
					href="https://wa.me/6281234567890?text=Halo, saya baru saja melakukan booking dengan ID: {$page.url.searchParams.get(
						'id'
					)}"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-2xl transition-colors mb-4"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
						/>
					</svg>
					Hubungi via WhatsApp
				</a>

				<div class="mt-8">
					<a href="/" class="text-gray-400 hover:text-white transition-colors">
						← Kembali ke Beranda
					</a>
				</div>
			{/if}
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
		<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
	</footer>
</div>
