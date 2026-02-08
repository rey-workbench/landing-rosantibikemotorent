<script lang="ts">
	import { onMount } from 'svelte';
	import { jenisMotorApi } from '$lib/api';
	import type { JenisMotor } from '$lib/types';

	let jenisMotors: JenisMotor[] = [];
	let loading = true;
	let error = '';

	// Helper to get minimum price from units
	function getMinPrice(jenis: JenisMotor): number {
		if (!jenis.unitMotor || jenis.unitMotor.length === 0) return 0;
		const availableUnits = jenis.unitMotor.filter((u) => u.status === 'TERSEDIA');
		if (availableUnits.length === 0) return Math.min(...jenis.unitMotor.map((u) => u.hargaSewa));
		return Math.min(...availableUnits.map((u) => u.hargaSewa));
	}

	// Helper to check if any unit is available
	function hasAvailableUnit(jenis: JenisMotor): boolean {
		if (!jenis.unitMotor || jenis.unitMotor.length === 0) return false;
		return jenis.unitMotor.some((u) => u.status === 'TERSEDIA');
	}

	onMount(async () => {
		try {
			const response = await jenisMotorApi.getAll({ limit: 4 });
			// Filter to only show jenis with available units
			jenisMotors = (response.data || []).filter((j) => hasAvailableUnit(j));
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data';
			console.error('Failed to load fleet:', err);
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
</script>

<section id="fleet" class="py-32 bg-brand-dark px-4 md:px-10 overflow-hidden">
	<div class="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
		<div>
			<h2
				class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center gap-2"
			>
				<span class="w-8 h-[1px] bg-blue-500"></span>
				Armada Kami
				<span class="w-8 h-[1px] bg-blue-500"></span>
			</h2>
			<h3
				class="text-4xl md:text-5xl lg:text-7xl font-black text-white mt-2 mb-6 leading-[0.9] uppercase tracking-tighter"
			>
				Pilih Motor <br />
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600"
					>Impianmu.</span
				>
			</h3>
		</div>
		<a
			href="/fleet"
			class="text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-colors"
		>
			Lihat Semua Unit →
		</a>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each [1, 2, 3, 4] as _}
				<div class="h-[450px] rounded-3xl bg-gray-800 animate-pulse"></div>
			{/each}
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-gray-400">{error}</p>
		</div>
	{:else if jenisMotors.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each jenisMotors as jenis}
				{@const minPrice = getMinPrice(jenis)}
				<a
					href="/fleet/{jenis.slug}"
					class="group relative h-[450px] overflow-hidden rounded-3xl bg-gray-900 cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-500"
				>
					<!-- Image -->
					<div class="absolute inset-0 z-0">
						{#if jenis.gambar}
							<img
								src={jenis.gambar}
								alt={`${jenis.merk} ${jenis.model}`}
								class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
							/>
						{:else}
							<div class="w-full h-full bg-gray-800 flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="64"
									height="64"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1"
									class="text-gray-600"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<path d="m21 15-5-5L5 21" />
								</svg>
							</div>
						{/if}
						<div
							class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70"
						></div>
					</div>

					<!-- Content -->
					<div class="relative z-10 h-full flex flex-col justify-end p-6">
						<div
							class="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0"
						>
							<div class="mb-4">
								<p class="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
									{jenis.merk}
								</p>
								<h3 class="text-2xl font-bold text-white mb-1 leading-tight">
									{jenis.model}
								</h3>
								<p class="text-gray-400 font-mono text-lg">
									{#if minPrice > 0}
										{formatPrice(minPrice)}
										<span class="text-xs text-gray-400">/ hari</span>
									{:else}
										<span class="text-gray-400">Hubungi kami</span>
									{/if}
								</p>
							</div>

							<!-- Features -->
							<div
								class="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 h-0 group-hover:h-auto"
							>
								<span
									class="px-2 py-1 bg-white/10 backdrop-blur-sm text-[10px] uppercase tracking-wider rounded text-white border border-white/10"
								>
									{jenis.cc} CC
								</span>
								<span
									class="px-2 py-1 bg-green-500/20 text-[10px] uppercase tracking-wider rounded text-green-400 border border-green-500/20"
								>
									Tersedia
								</span>
							</div>

							<!-- Action Button -->
							<span
								class="block w-full py-3 bg-white text-black font-bold rounded-xl text-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 hover:bg-gray-200"
							>
								Pesan Sekarang
							</span>
						</div>
					</div>

					<!-- Tag -->
					<div
						class="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10"
					>
						<span class="text-xs font-bold text-white uppercase tracking-wider">Premium</span>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-400">Tidak ada motor tersedia saat ini.</p>
			<a
				href="/fleet"
				class="text-white border-b border-white hover:border-gray-400 transition-colors mt-2 inline-block"
			>
				Lihat semua katalog
			</a>
		</div>
	{/if}
</section>
