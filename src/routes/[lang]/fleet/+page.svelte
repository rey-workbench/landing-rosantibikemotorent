<script lang="ts">
	import type { JenisMotor } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade, fly } from 'svelte/transition';

	export let data;

	let jenisMotors: any[] = data.jenisMotors;
	let brands: { id: string; merk: string }[] = data.brands;
	let loading = false;
	let error = '';

	let searchQuery = '';
	let selectedBrand = '';
	let priceRange = { min: 0, max: 1000000 };

	$: filteredMotors = jenisMotors.filter((jenis) => {
		const matchesSearch =
			jenis.merk.toLowerCase().includes(searchQuery.toLowerCase()) ||
			jenis.model.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesBrand = !selectedBrand || jenis.merk === selectedBrand;
		const matchesPrice =
			jenis.computed.minPrice >= priceRange.min && jenis.computed.minPrice <= priceRange.max;
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

<!-- Hero Section -->
<section class="pt-32 pb-16 px-4 md:px-10">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h2
				class="text-[10px] md:text-sm font-bold text-blue-500 tracking-[0.25em] mb-4 uppercase flex items-center gap-2"
			>
				<span class="w-8 h-[1px] bg-blue-500"></span>
				Armada Kami
			</h2>
			<h1
				class="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]"
			>
				Pilih Motor <br />
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-700"
					>Impianmu.</span
				>
			</h1>
		</div>

		<!-- Filter Section -->
		<div
			class="relative z-20 glass-surface rounded-2xl md:rounded-[2rem] p-5 md:p-8 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl"
		>
			<div class="space-y-1">
				<Input
					id="search-motor"
					label="Cari Motor"
					bind:value={searchQuery}
					placeholder="Cari..."
					icon="search"
				/>
			</div>

			<div class="space-y-1">
				<Input
					id="brand-filter"
					type="dropdown"
					label="Merek"
					bind:value={selectedBrand}
					options={[
						{ value: '', label: 'Semua Merek' },
						...brands.map((b) => ({ value: b.merk, label: b.merk }))
					]}
					placeholder="Semua"
				/>
			</div>

			<div class="space-y-1">
				<label
					for="price-min"
					class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest"
					>Range Harga</label
				>
				<div class="flex items-center gap-2 mt-1">
					<Input id="price-min" type="number" bind:value={priceRange.min} placeholder="Min" />
					<span class="text-gray-700 font-bold">-</span>
					<Input id="price-max" type="number" bind:value={priceRange.max} placeholder="Max" />
				</div>
			</div>
		</div>

		<!-- Main Grid (Updated for 2 columns on mobile) -->
		{#if loading}
			<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
				{#each Array(8) as _}
					<div
						class="aspect-[4/5] rounded-2xl md:rounded-[2.5rem] bg-brand-surface animate-pulse border border-white/5"
					></div>
				{/each}
			</div>
		{:else if error}
			<div class="text-center py-24 glass-surface rounded-[2rem]">
				<h3 class="text-xl font-black text-white uppercase mb-4">Gagal Memuat</h3>
				<Button size="sm" on:click={() => window.location.reload()}>Refresh</Button>
			</div>
		{:else if filteredMotors.length > 0}
			<!-- Updated Grid: grid-cols-2 on mobile -->
			<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
				{#each filteredMotors as jenis, i}
					<a
						href="/fleet/{jenis.slug}"
						class="group relative flex flex-col glass-surface rounded-2xl md:rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-white/20"
						in:fly={{ y: 20, duration: 500, delay: i * 30 }}
					>
						<!-- Image -->
						<div class="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-gray-900">
							{#if jenis.gambar}
								<img
									src={jenis.gambar}
									alt={`${jenis.merk} ${jenis.model}`}
									class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-800">
									<svg
										width="40"
										height="40"
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

							<!-- Status Badges -->
							<div class="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1">
								{#if !jenis.computed.hasAvailable}
									<span
										class="px-2 py-0.5 bg-red-500/80 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full"
									>
										Habis
									</span>
								{:else}
									<span
										class="px-2 py-0.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full"
									>
										{jenis.computed.availableCount} Unit
									</span>
								{/if}
							</div>
						</div>

						<!-- Content -->
						<div class="p-4 md:p-6 flex-1 flex flex-col justify-between">
							<div>
								<p
									class="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1"
								>
									{jenis.merk}
								</p>
								<h3
									class="text-sm md:text-xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors line-clamp-1"
								>
									{jenis.model}
								</h3>
							</div>

							<div class="mt-4 flex flex-col gap-2">
								<div class="flex items-baseline gap-1">
									{#if jenis.computed.minPrice > 0}
										<span class="text-sm md:text-xl font-black text-white uppercase">
											{formatPrice(jenis.computed.minPrice).replace(',00', '').replace('Rp', 'Rp ')}
										</span>
										<span class="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase"
											>/ Hari</span
										>
									{:else}
										<span class="text-xs font-black text-gray-500 uppercase">Hubungi Kami</span>
									{/if}
								</div>

								<div
									class="hidden md:flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all"
								>
									<span>Detail</span>
									<svg
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										><line x1="5" y1="12" x2="19" y2="12"></line><polyline
											points="12 5 19 12 12 19"
										/></svg
									>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="text-center py-24 glass-surface rounded-[2rem]">
				<h3 class="text-xl font-black text-white uppercase">Tidak Ditemukan</h3>
				<p class="text-gray-500 mt-2 text-sm">Coba atur ulang filter Anda.</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
