<script lang="ts">
	import { onMount } from 'svelte';
	import { unitMotorApi } from '$lib/api';
	import type { UnitMotor } from '$lib/types';

	let motors: UnitMotor[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await unitMotorApi.getAll({ status: 'TERSEDIA', limit: 4 });
			motors = response.data || [];
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
				Our Fleet
			</h2>
			<h3 class="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">
				Choose Your <br />
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700"
					>Ride.</span
				>
			</h3>
		</div>
		<a
			href="/fleet"
			class="text-white border-b border-white pb-1 hover:text-blue-500 hover:border-blue-500 transition-colors"
		>
			View Full Inventory →
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
	{:else if motors.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each motors as motor}
				{@const jenis = motor.jenis || motor.jenisMotor}
				{#if jenis}
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
									<p class="text-xs text-blue-500 font-mono uppercase tracking-wider mb-1">
										{jenis.merk}
									</p>
									<h3 class="text-2xl font-bold text-white mb-1 leading-tight">
										{jenis.model}
									</h3>
									<p class="text-blue-400 font-mono text-lg">
										{formatPrice(motor.hargaSewa)}
										<span class="text-xs text-gray-400">/ day</span>
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
										class="px-2 py-1 bg-white/10 backdrop-blur-sm text-[10px] uppercase tracking-wider rounded text-white border border-white/10"
									>
										{motor.tahunPembuatan || 'Premium'}
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
									Book Now
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
				{/if}
			{/each}
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-400">Tidak ada motor tersedia saat ini.</p>
			<a href="/fleet" class="text-blue-500 hover:underline mt-2 inline-block">
				Lihat semua katalog
			</a>
		</div>
	{/if}
</section>
