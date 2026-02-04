<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Preloader from '$lib/components/ui/Preloader.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { jenisMotorApi } from '$lib/api';
	import type { UnitMotor, JenisMotor } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';

	let motor: (UnitMotor & { jenis?: JenisMotor }) | null = null;
	let loading = true;
	let error = '';

	$: slug = $page.params.slug;

	onMount(async () => {
		if (!slug) {
			error = 'Slug tidak ditemukan';
			loading = false;
			return;
		}

		try {
			const jenisData = (await jenisMotorApi.getBySlug(slug)) as any;
			if (jenisData && jenisData.unitMotor && jenisData.unitMotor.length > 0) {
				// Cari unit yang tersedia, jika tidak ada ambil yang pertama
				const units = jenisData.unitMotor as UnitMotor[];
				const availableUnit = units.find((u) => u.status === 'TERSEDIA') || units[0];

				// Gabungkan data agar UI yang lama tetap bekerja
				motor = {
					...availableUnit,
					jenis: jenisData
				};
			} else {
				error = 'Tidak ada unit tersedia untuk model ini';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Motor tidak ditemukan';
		} finally {
			loading = false;
		}
	});

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}

	function handleBooking() {
		if (motor) {
			goto(`/booking?unitId=${motor.id}`);
		}
	}
</script>

<svelte:head>
	{#if motor}
		{@const jenis = motor.jenis || motor.jenisMotor}
		<title>{jenis?.merk} {jenis?.model} - Rosantibike Motorent</title>
		<meta
			name="description"
			content="Sewa {jenis?.merk} {jenis?.model} dengan harga {formatPrice(
				motor.hargaSewa
			)} per hari di Rosantibike Motorent Malang."
		/>
	{:else}
		<title>Detail Motor - Rosantibike Motorent</title>
	{/if}
</svelte:head>

<Preloader />

<div class="min-h-screen bg-brand-dark text-white">
	<Navbar />

	<!-- Back Button -->
	<div class="pt-24 px-4 md:px-10">
		<div class="max-w-7xl mx-auto">
			<a
				href="/fleet"
				class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				Kembali ke Katalog
			</a>
		</div>
	</div>

	<!-- Loading State -->
	{#if loading}
		<div class="flex justify-center py-32">
			<div
				class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
			></div>
		</div>
	{:else if error}
		<div class="text-center py-32">
			<div class="text-6xl mb-4">⚠️</div>
			<h3 class="text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
			<p class="text-gray-400">{error}</p>
			<a
				href="/fleet"
				class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
			>
				Kembali ke Katalog
			</a>
		</div>
	{:else if motor}
		{@const jenis = motor.jenis || motor.jenisMotor}
		<!-- Main Content -->
		<section class="py-12 px-4 md:px-10">
			<div class="max-w-7xl mx-auto">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<!-- Image Section -->
					<div class="relative">
						<div
							class="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-900 border border-white/10"
						>
							{#if jenis?.gambar}
								<img
									src={jenis.gambar}
									alt={`${jenis.merk} ${jenis.model}`}
									class="w-full h-full object-cover"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-600">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="128"
										height="128"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1"
									>
										<rect x="3" y="3" width="18" height="18" rx="2" />
										<circle cx="8.5" cy="8.5" r="1.5" />
										<path d="m21 15-5-5L5 21" />
									</svg>
								</div>
							{/if}
						</div>

						<!-- Status Badge -->
						<div
							class="absolute top-6 left-6 px-4 py-2 rounded-full backdrop-blur-md {motor.status ===
							'TERSEDIA'
								? 'bg-green-500/20 border border-green-500/30'
								: motor.status === 'DISEWA'
									? 'bg-yellow-500/20 border border-yellow-500/30'
									: 'bg-red-500/20 border border-red-500/30'}"
						>
							<span
								class="text-sm font-bold uppercase tracking-wider {motor.status === 'TERSEDIA'
									? 'text-green-400'
									: motor.status === 'DISEWA'
										? 'text-yellow-400'
										: 'text-red-400'}"
							>
								{motor.status === 'TERSEDIA'
									? '✓ Tersedia'
									: motor.status === 'DISEWA'
										? 'Sedang Disewa'
										: 'Maintenance'}
							</span>
						</div>
					</div>

					<!-- Details Section -->
					<div class="flex flex-col justify-center">
						<!-- Breadcrumb -->
						<p class="text-blue-500 font-mono text-sm uppercase tracking-widest mb-2">
							{jenis?.merk}
						</p>

						<h1
							class="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6"
						>
							{jenis?.model}
						</h1>

						<p class="text-gray-400 text-lg mb-8 leading-relaxed">
							Rasakan kenyamanan berkendara dengan {jenis?.merk}
							{jenis?.model}. Motor ini dilengkapi dengan mesin {jenis?.cc}cc yang bertenaga dan
							irit bahan bakar.
						</p>

						<!-- Specs Grid -->
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
							<div class="bg-white/5 border border-white/10 rounded-2xl p-4">
								<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Kapasitas Mesin</p>
								<p class="text-2xl font-bold text-white">
									{jenis?.cc} <span class="text-sm text-gray-400">CC</span>
								</p>
							</div>
							<div class="bg-white/5 border border-white/10 rounded-2xl p-4">
								<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Tahun</p>
								<p class="text-2xl font-bold text-white">{motor.tahunPembuatan || '-'}</p>
							</div>
							<div class="bg-white/5 border border-white/10 rounded-2xl p-4">
								<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Plat Nomor</p>
								<p class="text-2xl font-bold text-white">{motor.platNomor}</p>
							</div>
						</div>

						<!-- Price & Booking -->
						<div
							class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8"
						>
							<div class="flex items-end justify-between mb-6">
								<div>
									<p class="text-gray-400 text-sm uppercase tracking-wider mb-1">Harga Sewa</p>
									<p class="text-4xl font-black text-white">
										{formatPrice(motor.hargaSewa)}
									</p>
									<p class="text-gray-400 text-sm">per 24 jam</p>
								</div>
							</div>

							{#if motor.status === 'TERSEDIA'}
								<Button on:click={handleBooking} fullWidth size="lg">Booking Sekarang</Button>
							{:else}
								<Button disabled fullWidth size="lg" variant="secondary">
									{motor.status === 'DISEWA' ? 'Sedang Disewa' : 'Dalam Maintenance'}
								</Button>
							{/if}

							<p class="text-center text-gray-500 text-sm mt-4">
								Atau hubungi via WhatsApp untuk info lebih lanjut
							</p>
						</div>
					</div>
				</div>

				<!-- Additional Info -->
				<div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
					<div class="bg-white/5 border border-white/10 rounded-3xl p-8">
						<div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="text-blue-400"
							>
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-white mb-2">Asuransi Lengkap</h3>
						<p class="text-gray-400">
							Setiap unit sudah termasuk asuransi kecelakaan untuk keamanan Anda.
						</p>
					</div>

					<div class="bg-white/5 border border-white/10 rounded-3xl p-8">
						<div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="text-green-400"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-white mb-2">Unit Terawat</h3>
						<p class="text-gray-400">Seluruh motor melalui pengecekan rutin sebelum disewakan.</p>
					</div>

					<div class="bg-white/5 border border-white/10 rounded-3xl p-8">
						<div
							class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="text-purple-400"
							>
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</div>
						<h3 class="text-xl font-bold text-white mb-2">Support 24/7</h3>
						<p class="text-gray-400">
							Tim kami siap membantu kapan saja jika Anda membutuhkan bantuan.
						</p>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Footer -->
	<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
		<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
	</footer>
</div>
