<script lang="ts">
	import { onMount } from 'svelte';
	import { jenisMotorService } from '$lib/services';
	import { DEFAULTS } from '$lib/constants';
	import { getFallbackImage, getMotorImage, handleImageError } from '$lib/utils/image';
	import { LL, locale } from '$i18n/i18n-svelte';
	import { page } from '$app/state';

	let { jenisMotors = $bindable([]) } = $props();
	let lang = $derived(page.params.lang || $locale);
	let loading = $state(jenisMotors.length === 0);
	let error = $state('');

	async function fetchFleet() {
		try {
			const response = await jenisMotorService.getAll({ limit: DEFAULTS.FLEET_FEATURED_LIMIT });
			jenisMotors = response.data || [];
		} catch (err) {
			error = err instanceof Error ? err.message : $LL.fleet_error();
			console.error('Failed to load fleet:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// Only fetch if not already pre-loaded from SSR
		if (jenisMotors.length === 0) {
			fetchFleet();
		} else {
			loading = false;
		}
	});
</script>

<section id="fleet" class="py-20 md:py-28 bg-[#f5f5f7]">
	<div class="max-w-7xl mx-auto px-6 mb-12 text-center">
		<h2 class="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-3">
			{$LL.fleet_heading()}
		</h2>
		<p class="text-xl md:text-2xl text-[#6b6b70] font-normal max-w-2xl mx-auto">
			{$LL.fleet_heading_highlight()}
		</p>
	</div>

	{#if loading}
		<div class="max-w-345 mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each [1, 2, 3, 4] as _}
				<div class="h-130 rounded-3xl bg-white animate-pulse"></div>
			{/each}
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-[#6b6b70]">{error}</p>
		</div>
	{:else if jenisMotors.length > 0}
		<div class="max-w-345 mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each jenisMotors as jenis, index}
				<div
					class="group relative flex flex-col aspect-video rounded-3xl overflow-hidden {index %
						3 ===
					0
						? 'text-white md:col-span-2'
						: 'text-[#1d1d1f] border border-black/5'}"
				>
					<!-- The image IS the entire card background. Height follows image exactly. -->
					{#if getMotorImage(jenis)}
						<img
							src={getMotorImage(jenis)}
							alt={`Sewa Motor ${jenis.merk} ${jenis.model} Malang - Rosantibike`}
							data-fallback={getFallbackImage(jenis)}
							onerror={handleImageError}
							loading="lazy"
							decoding="async"
							width="800"
							height="450"
							class="w-full h-full object-cover z-0 pointer-events-none transition-transform duration-700 group-hover:scale-105"
						/>
					{:else}
						<div class="w-full aspect-video"></div>
					{/if}

					<!-- Top Content (Title, Price, CTA) - Conditional compact absolute overlay -->
					<div
						class="absolute top-0 left-0 right-0 {index % 3 === 0
							? 'pt-6 px-4 md:pt-8 md:px-8'
							: 'pt-4 px-4 md:pt-5 md:px-6'} z-10 flex flex-col items-center w-full"
					>
						<span
							class="{index % 3 === 0
								? 'text-[10px] md:text-xs mb-1'
								: 'text-[10px] mb-0.5'} font-semibold uppercase tracking-[0.2em] text-[#6b6b70]"
						>
							{jenis.merk}
						</span>
						<h3
							class="{index % 3 === 0
								? 'text-2xl md:text-4xl mb-1 text-white'
								: 'text-xl md:text-3xl mb-0.5 text-[#1d1d1f]'} font-bold tracking-tight"
						>
							{jenis.model}
						</h3>
						{#if jenis.computed.minPrice > 0}
							<p
								class="{index % 3 === 0
									? 'text-base md:text-lg mb-3 md:mb-4'
									: 'text-sm md:text-base mb-2 md:mb-3'} text-[#6b6b70] font-normal"
							>
								{$LL.fleet_start_from()}
								{$LL.format_currency(jenis.computed.minPrice)}
								{$LL.fleet_per_day().toLowerCase()}
							</p>
						{:else}
							<p
								class="{index % 3 === 0
									? 'text-base mb-3 md:mb-4'
									: 'text-sm mb-2 md:mb-3'} text-[#6b6b70] font-normal"
							>
								{$LL.fleet_contact_us()}
							</p>
						{/if}

						<!-- CTA Buttons (Authentic Apple Dual Pills) -->
						<div
							class="flex items-center gap-2 md:gap-3 {index % 3 === 0
								? ''
								: 'scale-90 md:scale-100 origin-top'}"
						>
							<a
								href="/{lang}/booking?unit={jenis.slug}"
								aria-label="{$LL.fleet_order()} {jenis.merk} {jenis.model}"
								class="px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-apple-blue hover:bg-[#0077ed] text-white font-medium text-xs md:text-sm transition-colors shadow-xs"
							>
								{$LL.fleet_order()}
							</a>
							<a
								href="/{lang}/fleet/{jenis.slug}"
								aria-label="{$LL.fleet_see_detail()} {jenis.merk} {jenis.model}"
								class="px-4 py-1.5 md:px-5 md:py-2 rounded-full border {index % 3 === 0
									? 'border-apple-link text-apple-link hover:bg-apple-link hover:text-white'
									: 'border-apple-blue text-apple-blue hover:bg-apple-blue hover:text-white'} font-medium text-xs md:text-sm transition-all shadow-xs"
							>
								{$LL.fleet_see_detail()}
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12">
			<a
				href="/{lang}/fleet"
				class="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#1d1d1f] text-white font-medium text-base hover:opacity-90 transition-opacity"
			>
				<span>{$LL.fleet_view_all()}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-[#6b6b70]">{$LL.fleet_empty_desc()}</p>
		</div>
	{/if}
</section>
