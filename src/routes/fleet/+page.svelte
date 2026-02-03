<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { onMount } from 'svelte';
	import { unitMotorApi } from '$lib/api';
	import type { UnitMotor } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	let motors: UnitMotor[] = [];
	let brands: { id: string; merk: string }[] = [];
	let loading = true;
	let error = '';

	let searchQuery = '';
	let selectedBrand = '';
	let priceRange = { min: 0, max: 500000 };

	onMount(async () => {
		try {
			const [motorsResponse, brandsResponse] = await Promise.all([
				unitMotorApi.getAll({ status: 'TERSEDIA' }),
				unitMotorApi.getBrands()
			]);
			motors = motorsResponse.data || [];
			brands = brandsResponse || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data';
		} finally {
			loading = false;
		}
	});

	$: filteredMotors = motors.filter((motor) => {
		const jenis = motor.jenis || motor.jenisMotor;
		if (!jenis) return false;
		const matchesSearch =
			jenis.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
			jenis.model.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesBrand = !selectedBrand || jenis.merk === selectedBrand;
		const matchesPrice = motor.hargaSewa >= priceRange.min && motor.hargaSewa <= priceRange.max;
		return matchesSearch && matchesBrand && matchesPrice;
	});

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}
</script>

<svelte:head>
	<title>Katalog Motor - Rosantibike Motorent</title>
	<meta
		name="description"
		content="Jelajahi koleksi motor premium kami. Berbagai pilihan motor berkualitas dengan harga terjangkau di Malang."
	/>
</svelte:head>

<div class="min-h-screen bg-brand-dark text-white">
	<Navbar />

	<!-- Hero Section -->
	<section class="pt-32 pb-16 px-4 md:px-10">
		<div class="max-w-7xl mx-auto">
			<div class="mb-12">
				<h2
					class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center gap-2"
				>
					<span class="w-8 h-[1px] bg-blue-500"></span>
					Our Fleet
				</h2>
				<h1
					class="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none"
				>
					Choose Your <br />
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600"
						>Ride.</span
					>
				</h1>
				<p class="text-gray-400 mt-6 max-w-xl text-lg">
					Temukan motor impianmu dari koleksi premium kami. Semua unit terawat dan siap menemani
					petualanganmu.
				</p>
			</div>

			<!-- Filter Section -->
			<div
				class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
			>
				<!-- Search -->
				<Input
					id="search-motor"
					label="Cari Motor"
					bind:value={searchQuery}
					placeholder="Ketik nama motor..."
					icon="search"
				/>

				<!-- Brand Filter -->
				<Select
					id="brand-filter"
					label="Merek"
					bind:value={selectedBrand}
					options={[
						{ value: '', label: 'Semua Merek' },
						...brands.map((b) => ({ value: b.merk, label: b.merk }))
					]}
					placeholder="Pilih Merek"
				/>

				<!-- Price Range Display -->
				<div>
					<label for="price-min" class="block text-sm text-gray-400 mb-2 uppercase tracking-wider"
						>Rentang Harga</label
					>
					<div class="flex items-center gap-4">
						<Input id="price-min" type="number" bind:value={priceRange.min} placeholder="Min" />
						<span class="text-gray-500">-</span>
						<Input id="price-max" type="number" bind:value={priceRange.max} placeholder="Max" />
					</div>
				</div>
			</div>

			<!-- Loading State -->
			{#if loading}
				<div class="flex justify-center py-20">
					<div
						class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
					></div>
				</div>
			{:else if error}
				<div class="text-center py-20">
					<div class="text-6xl mb-4">⚠️</div>
					<h3 class="text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
					<p class="text-gray-400">{error}</p>
				</div>
			{:else}
				<!-- Results Count -->
				<div class="flex items-center justify-between mb-8">
					<p class="text-gray-400">
						Menampilkan <span class="text-white font-bold">{filteredMotors.length}</span> motor
					</p>
				</div>

				<!-- Motor Grid -->
				{#if filteredMotors.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{#each filteredMotors as motor}
							{@const jenis = motor.jenis || motor.jenisMotor}
							{#if jenis}
								<a
									href="/fleet/{jenis.slug}"
									class="group relative bg-gray-900 rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
								>
									<!-- Image -->
									<div class="aspect-[4/3] overflow-hidden bg-gray-800">
										{#if jenis.gambar}
											<img
												src={jenis.gambar}
												alt={`${jenis.merk} ${jenis.model}`}
												class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center text-gray-600">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="64"
													height="64"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="1"
													><rect x="3" y="3" width="18" height="18" rx="2" /><circle
														cx="8.5"
														cy="8.5"
														r="1.5"
													/><path d="m21 15-5-5L5 21" /></svg
												>
											</div>
										{/if}
										<div
											class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"
										></div>
									</div>

									<!-- Content -->
									<div class="p-6">
										<div class="flex items-start justify-between mb-2">
											<div>
												<p class="text-xs text-blue-500 font-mono uppercase tracking-wider">
													{jenis.merk}
												</p>
												<h3 class="text-xl font-bold text-white">
													{jenis.model}
												</h3>
											</div>
											<span
												class="text-xs px-2 py-1 rounded-full {motor.status === 'TERSEDIA'
													? 'bg-green-500/20 text-green-400'
													: motor.status === 'DISEWA'
														? 'bg-yellow-500/20 text-yellow-400'
														: 'bg-red-500/20 text-red-400'}"
											>
												{motor.status}
											</span>
										</div>

										<div class="flex items-center gap-4 text-sm text-gray-400 mb-4">
											<span>{jenis.cc} CC</span>
											<span>•</span>
											<span>{motor.tahunPembuatan || '-'}</span>
										</div>

										<div class="flex items-end justify-between">
											<div>
												<p class="text-2xl font-bold text-white">
													{formatPrice(motor.hargaSewa)}
												</p>
												<p class="text-xs text-gray-500">per hari</p>
											</div>
											<span
												class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors"
											>
												Detail
											</span>
										</div>
									</div>

									<!-- Status Badge -->
									{#if motor.status !== 'TERSEDIA'}
										<div
											class="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full"
										>
											<span class="text-xs font-bold text-white uppercase tracking-wider"
												>{motor.status === 'DISEWA' ? 'Sedang Disewa' : 'Maintenance'}</span
											>
										</div>
									{/if}
								</a>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="text-center py-20">
						<div class="text-6xl mb-4">🏍️</div>
						<h3 class="text-2xl font-bold text-white mb-2">Tidak Ada Motor Ditemukan</h3>
						<p class="text-gray-400">Coba ubah filter pencarian Anda</p>
					</div>
				{/if}
			{/if}
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
		<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
	</footer>
</div>
