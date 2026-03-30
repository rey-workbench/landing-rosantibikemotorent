<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { LL } from '$i18n/i18n-svelte';

	export let data;
	$: motor = data.motor;
	$: jenis = motor?.jenisMotor;
	$: displayPrice = jenis?.hargaSewa || 0;
	$: lang = $page.params.lang || 'id';

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}

	function handleBooking() {
		if (motor) {
			goto(`/${lang}/booking?unitId=${motor.id}`);
		}
	}
</script>

<svelte:head>
	{#if motor && jenis}
		<title>{jenis.merk} {jenis.model} | Rosantibike Motorent</title>
		<meta
			name="description"
			content={$LL.fleet_detail_description({ merk: jenis.merk, model: jenis.model, cc: jenis.cc })}
		/>
	{:else}
		<title>{$LL.page_title_fleet_detail()} | Rosantibike Motorent</title>
	{/if}
</svelte:head>

<!-- Back Button -->
<div class="pt-24 px-4 md:px-10">
	<div class="max-w-7xl mx-auto">
		<a
			href="/{lang}/fleet"
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
			{$LL.fleet_detail_back()}
		</a>
	</div>
</div>

{#if motor && jenis}
	<!-- Main Content -->
	<section class="py-12 px-4 md:px-10">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<!-- Image Section -->
				<div class="relative">
					<div class="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-900 border border-white/10">
						{#if jenis.gambar}
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
								? $LL.fleet_detail_status_available()
								: motor.status === 'DISEWA'
									? $LL.fleet_detail_status_rented()
									: $LL.fleet_detail_status_maintenance()}
						</span>
					</div>
				</div>

				<!-- Details Section -->
				<div class="flex flex-col justify-center">
					<!-- Breadcrumb -->
					<p class="text-blue-500 font-mono text-sm uppercase tracking-widest mb-2">
						{jenis.merk}
					</p>

					<h1
						class="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6"
					>
						{jenis.model}
					</h1>

					<p class="text-gray-400 text-lg mb-8 leading-relaxed">
						{$LL.fleet_detail_description({ merk: jenis.merk, model: jenis.model, cc: jenis.cc })}
					</p>

					<!-- Specs Grid -->
					<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
						<div class="bg-white/5 border border-white/10 rounded-2xl p-4">
							<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">
								{$LL.fleet_detail_engine()}
							</p>
							<p class="text-2xl font-bold text-white">
								{jenis.cc} <span class="text-sm text-gray-400">CC</span>
							</p>
						</div>
						<div class="bg-white/5 border border-white/10 rounded-2xl p-4">
							<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">
								{$LL.fleet_detail_year()}
							</p>
							<p class="text-2xl font-bold text-white">{motor.tahunPembuatan || '-'}</p>
						</div>
						<div class="bg-white/5 border border-white/10 rounded-2xl p-4">
							<p class="text-gray-500 text-xs uppercase tracking-wider mb-1">
								{$LL.fleet_detail_plate()}
							</p>
							<p class="text-2xl font-bold text-white">{motor.platNomor}</p>
						</div>
					</div>

					<!-- Price & Booking -->
					<div
						class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8"
					>
						<div class="flex items-end justify-between mb-6">
							<div>
								<p class="text-gray-400 text-sm uppercase tracking-wider mb-1">
									{$LL.fleet_detail_price()}
								</p>
							<p class="text-4xl font-black text-white">
								{formatPrice(displayPrice)}
							</p>
								<p class="text-gray-400 text-sm">{$LL.fleet_detail_per_day()}</p>
							</div>
						</div>

						{#if motor.status === 'TERSEDIA'}
							<Button on:click={handleBooking} fullWidth size="lg"
								>{$LL.fleet_detail_book_now()}</Button
							>
						{:else}
							<Button disabled fullWidth size="lg" variant="secondary">
								{motor.status === 'DISEWA'
									? $LL.fleet_detail_status_rented()
									: $LL.fleet_detail_status_maintenance()}
							</Button>
						{/if}

						<p class="text-center text-gray-500 text-sm mt-4">
							{$LL.fleet_detail_contact_whatsapp()}
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
					<h3 class="text-xl font-bold text-white mb-2">{$LL.fleet_detail_insurance()}</h3>
					<p class="text-gray-400">
						{$LL.fleet_detail_insurance_desc()}
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
					<h3 class="text-xl font-bold text-white mb-2">{$LL.fleet_detail_well_maintained()}</h3>
					<p class="text-gray-400">{$LL.fleet_detail_well_maintained_desc()}</p>
				</div>

				<div class="bg-white/5 border border-white/10 rounded-3xl p-8">
					<div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
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
					<h3 class="text-xl font-bold text-white mb-2">{$LL.fleet_detail_support()}</h3>
					<p class="text-gray-400">
						{$LL.fleet_detail_support_desc()}
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}
