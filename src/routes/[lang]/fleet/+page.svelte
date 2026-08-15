<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import { jenisMotorApi } from '$lib/api';
	import { fly } from 'svelte/transition';
	import { SeoHead } from '$lib/components/seo';
	import LL from '$i18n/i18n-svelte.js';
	import { page } from '$app/state';
	import { locale } from '$i18n/i18n-svelte';
	import { websocketService } from '$lib/services/websocket';
	import { formatCurrency } from '$lib/utils/format';
	import { getFallbackImage, getMotorImage, handleImageError } from '$lib/utils/image';

	let { data } = $props();

	let jenisMotors: any[] = $state(untrack(() => data.jenisMotors));

	$effect(() => {
		jenisMotors = data.jenisMotors;
	});

	let loading = $state(false);
	let error = $state('');
	let unsubs: (() => void)[] = [];

	let lang = $derived((page.params.lang || $locale) as 'id' | 'en');
	let currentUrl = $derived(page.url.href);

	async function fetchFleet() {
		loading = true;
		try {
			const response = await jenisMotorApi.getAll({ limit: 100 });
			jenisMotors = response.data || [];
		} catch (err: any) {
			console.error('Failed to load fleet:', err);
			error = 'Gagal memuat data armada.';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		websocketService.connect();

		const refresh = () => {
			fetchFleet();
		};

		unsubs = [
			websocketService.onTransactionUpdate(refresh),
			websocketService.onUnitMotorUpdate(refresh)
		];
	});

	onDestroy(() => {
		unsubs.forEach((unsub) => unsub());
	});
</script>

<SeoHead
	{lang}
	meta={{
		title: `${$LL.page_title_fleet()} | Rosantibike Motorent`,
		description: $LL.footer_about(),
		ogType: 'website',
		canonicalUrl: currentUrl
	}}
/>

<!-- Chapternav (Sticky under main navbar) -->
<div
	class="sticky top-12 w-full bg-white/90 backdrop-blur-md z-40 border-b border-[#d2d2d7] transition-all"
>
	<div class="max-w-5xl mx-auto px-4 h-18 flex items-center relative overflow-hidden">
		<!-- Left Title -->
		<div
			class="absolute left-4 z-10 text-[21px] font-semibold text-[#1d1d1f] tracking-tight bg-white md:bg-transparent pr-4 py-2"
		>
			{$LL.fleet_title()}
		</div>

		<!-- Centered scrolling items -->
		<div
			class="flex-1 flex items-center md:justify-center justify-start gap-8 overflow-x-auto no-scrollbar snap-x pl-25 md:pl-0 h-full w-full"
		>
			{#each jenisMotors as motor}
				<a
					href="#{motor.slug}"
					class="flex flex-col items-center justify-end gap-1.5 shrink-0 snap-start group min-w-13.5 opacity-80 hover:opacity-100 transition-opacity"
					style="text-decoration: none;"
				>
					<div class="h-9 flex items-end justify-center relative">
						{#if getMotorImage(motor)}
							<img
								src={getMotorImage(motor)}
								alt={`Sewa Motor ${motor.merk} ${motor.model} Malang - Rosantibike`}
								data-fallback={getFallbackImage(motor)}
								class="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
								onerror={handleImageError}
							/>
							<div
								class="h-6 w-6 bg-[#f5f5f7] rounded-full items-center justify-center text-[8px] text-[#6b6b70] font-medium border border-black/5"
								style="display: none;"
							>
								?
							</div>
						{:else}
							<div
								class="h-6 w-6 bg-[#f5f5f7] rounded-full flex items-center justify-center text-[8px] text-[#6b6b70] font-medium border border-black/5"
							>
								?
							</div>
						{/if}
					</div>
					<span class="text-[11px] font-medium text-[#1d1d1f] whitespace-nowrap leading-none"
						>{motor.model}</span
					>
				</a>
			{/each}
		</div>
	</div>
</div>

<main class="bg-white min-h-screen">
	<!-- Jelajahi Jajarannya Section -->
	<section class="max-w-5xl mx-auto px-4 pt-16 pb-20">
		<div class="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
			<h2
				class="text-[40px] md:text-[48px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight"
			>
				{$LL.fleet_explore_lineup()}
			</h2>
			<a
				href="/{lang}/booking"
				class="text-apple-blue font-medium hover:underline text-[15px] mb-2"
			>
				{$LL.fleet_compare_all()} &gt;
			</a>
		</div>

		{#if loading}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Array(6) as _}
					<div class="h-120 bg-[#f5f5f7] rounded-4xl animate-pulse"></div>
				{/each}
			</div>
		{:else if error}
			<div class="text-center py-20 text-[#6b6b70]">
				{error}
			</div>
		{:else if jenisMotors.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each jenisMotors as motor, i}
					<div
						id={motor.slug}
						class="bg-white rounded-3xl flex flex-col text-center transition-transform hover:scale-[1.01] duration-500 ease-out scroll-mt-32 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden"
						in:fly={{
							y: 30,
							duration: 800,
							delay: Math.min(i * 50, 300),
							easing: (t) => 1 - Math.pow(1 - t, 4)
						}}
					>
						<!-- Product Image (Edge to edge) -->
						<div
							class="w-full relative flex items-center justify-center overflow-hidden bg-[#f5f5f7]"
						>
							{#if getMotorImage(motor)}
								<img
									src={getMotorImage(motor)}
									alt={`Sewa Motor ${motor.merk} ${motor.model} Malang - Rosantibike`}
									data-fallback={getFallbackImage(motor)}
									class="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
									onerror={handleImageError}
								/>
								<div
									class="w-24 h-24 bg-black/5 rounded-full items-center justify-center text-black/20 absolute"
									style="display:none;"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="32"
										height="32"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><rect x="3" y="3" width="18" height="18" rx="2" /><circle
											cx="8.5"
											cy="8.5"
											r="1.5"
										/><path d="m21 15-5-5L5 21" /></svg
									>
								</div>
							{:else}
								<div class="w-full aspect-4/3 flex items-center justify-center">
									<div
										class="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center text-black/20"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><rect x="3" y="3" width="18" height="18" rx="2" /><circle
												cx="8.5"
												cy="8.5"
												r="1.5"
											/><path d="m21 15-5-5L5 21" /></svg
										>
									</div>
								</div>
							{/if}
						</div>

						<!-- Typography & Content -->
						<div class="flex flex-col items-center px-6 pt-8 pb-8 flex-1">
							<h3 class="text-[12px] font-semibold tracking-widest text-[#f56900] mb-2 uppercase">
								{motor.merk}
							</h3>
							<h2 class="text-[28px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
								{motor.model}
							</h2>

							{#if motor.computed.minPrice > 0}
								<p class="text-[15px] text-[#1d1d1f] font-normal mb-8">
									{$LL.fleet_start_from()}
									{formatCurrency(motor.computed.minPrice)}{$LL.fleet_per_day()}
								</p>
							{:else}
								<p class="text-[15px] text-[#6b6b70] font-normal mb-8">{$LL.fleet_contact_us()}</p>
							{/if}

							<!-- Buttons -->
							<div class="flex flex-col gap-3 w-full max-w-35 mt-auto">
								<a
									href="/{lang}/booking?unit={motor.slug}"
									class="w-full py-2 bg-[#0071e3] text-white rounded-full text-[15px] font-normal hover:bg-[#0077ed] transition-colors shadow-sm"
								>
									{$LL.fleet_order()}
								</a>
								<a
									href="/{lang}/fleet/{motor.slug}"
									class="w-full py-2 text-apple-blue text-[15px] font-normal hover:underline"
								>
									{$LL.fleet_link_detail()} &gt;
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-20 text-[#6b6b70] text-lg font-medium">
				{$LL.fleet_empty_desc()}
			</div>
		{/if}
	</section>

	<!-- Lihat lebih dekat Section -->
	<section class="max-w-5xl mx-auto px-4 pb-24">
		<h2
			class="text-[40px] md:text-[48px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight mb-10"
		>
			{$LL.fleet_look_closer()}
		</h2>

		<div
			class="relative w-full h-125 md:h-160 bg-[#f5f5f7] rounded-4xl overflow-hidden flex flex-col justify-center items-center text-center p-8 group"
		>
			<!-- Cinematic Background -->
			<div
				class="absolute inset-0 bg-center bg-cover transition-transform duration-2000 ease-out group-hover:scale-105"
				style="background-image: url('/images/[page]/look-closer.jpeg');"
			></div>
			<!-- Overlay gradient to make text readable -->
			<div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10"></div>

			<!-- Content overlay -->
			<div class="relative z-10 text-white mt-auto pb-12 w-full max-w-2xl">
				<h3
					class="text-3xl md:text-[48px] leading-[1.1] font-semibold mb-5 tracking-tight text-balance"
				>
					{@html $LL.fleet_experience_title()}
				</h3>
				<p
					class="text-lg md:text-[21px] leading-relaxed font-medium text-white/90 mb-8 text-balance"
				>
					{$LL.fleet_experience_desc()}
				</p>
				<a
					href="/{lang}/booking"
					class="inline-block px-8 py-3.5 bg-white text-[#1d1d1f] rounded-full text-[15px] font-semibold hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
				>
					{$LL.nav_book_now()}
				</a>
			</div>
		</div>
	</section>
</main>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
