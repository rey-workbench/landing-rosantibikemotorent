<script lang="ts">
	import { onMount } from 'svelte';
	import { jenisMotorApi } from '$lib/api';
	import { formatCurrency } from '$lib/utils/format';
	import { LL, locale } from '$i18n/i18n-svelte';
	import { page } from '$app/state';

	let { jenisMotors = $bindable([]) } = $props();
	let lang = $derived(page.params.lang || $locale);
	let loading = $state(jenisMotors.length === 0);
	let error = $state('');

	onMount(async () => {
		if (jenisMotors.length > 0) {
			loading = false;
			return;
		}

		try {
			const response = await jenisMotorApi.getAll({ limit: 4 });
			jenisMotors = (response.data || []).filter((j: any) => j.computed.hasAvailable);
		} catch (err) {
			error = err instanceof Error ? err.message : $LL.fleet_error();
			console.error('Failed to load fleet:', err);
		} finally {
			loading = false;
		}
	});

	function formatPrice(price: number): string {
		return formatCurrency(price);
	}
</script>

<section id="fleet" class="py-20 md:py-32 bg-brand-dark section-shell overflow-hidden">
	<div class="max-w-7xl mx-auto mb-10 md:mb-16 flex flex-col items-start gap-6">
		<div>
			<h2 class="section-kicker mb-2 md:mb-4">
				<span class="kicker-line"></span>
				{$LL.fleet_title()}
				<span class="kicker-line"></span>
			</h2>
			<h3 class="section-title mt-2 mb-2 md:mb-6">
				{$LL.fleet_heading()} <br />
				<span class="section-title-highlight">{$LL.fleet_heading_highlight()}</span>
			</h3>
		</div>
		<a
			href="/{lang}/fleet"
			class="text-xs md:text-base text-white border-b border-[rgba(166,173,187,0.5)] pb-1 hover:text-[var(--brand-highlight)] hover:border-[var(--brand-highlight)] transition-colors"
		>
			{$LL.fleet_view_all()} →
		</a>
	</div>

	{#if loading}
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
			{#each [1, 2, 3, 4] as _}
				<div class="h-[250px] md:h-[450px] surface-card animate-pulse"></div>
			{/each}
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-muted">{error}</p>
		</div>
	{:else if jenisMotors.length > 0}
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
			{#each jenisMotors as jenis}
				<a
					href="/{lang}/fleet/{jenis.slug}"
					class="group relative h-[280px] md:h-[450px] flex flex-col surface-card overflow-hidden"
				>
					<div class="relative h-[60%] md:h-[60%] overflow-hidden bg-[var(--brand-surface-soft)]">
						{#if jenis.gambar}
							<img
								src={jenis.gambar}
								alt={`${jenis.merk} ${jenis.model}`}
								class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
							/>
						{:else}
							<div
								class="w-full h-full bg-[rgba(166,173,187,0.12)] flex items-center justify-center"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="40"
									height="40"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1"
									class="text-[rgba(166,173,187,0.62)]"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<path d="m21 15-5-5L5 21" />
								</svg>
							</div>
						{/if}
						<div
							class="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60"
						></div>

						<div class="absolute top-2 left-2 md:top-4 md:left-4">
							{#if !jenis.computed.hasAvailable}
								<span class="label-pill bg-red-500/80 text-white">
									{$LL.fleet_empty()}
								</span>
							{:else}
								<span class="label-pill bg-green-500/20 border border-green-500/30 text-green-300">
									{$LL.fleet_available()}
								</span>
							{/if}
						</div>
					</div>

					<div class="flex-1 p-3 md:p-6 flex flex-col justify-between bg-brand-surface">
						<div>
							<p
								class="text-[8px] md:text-xs text-[var(--brand-highlight)] font-black uppercase tracking-widest mb-0.5 md:mb-1"
							>
								{jenis.merk}
							</p>
							<h3
								class="text-sm md:text-2xl font-black text-white leading-tight uppercase line-clamp-1 md:line-clamp-none"
							>
								{jenis.model}
							</h3>
						</div>

						<div class="flex items-end justify-between mt-2">
							<div>
								{#if jenis.computed.minPrice > 0}
									<p class="text-sm md:text-2xl font-black text-white">
										{formatPrice(jenis.computed.minPrice).replace(',00', '').replace('Rp', 'Rp ')}
									</p>
									<p class="text-[8px] md:text-xs text-muted font-bold uppercase tracking-wider">
										{$LL.fleet_per_day()}
									</p>
								{:else}
									<span class="text-xs text-muted font-bold uppercase"
										>{$LL.fleet_contact_us()}</span
									>
								{/if}
							</div>

							<div
								class="hidden md:flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all"
							>
								<span>{$LL.fleet_order()}</span>
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
		<div class="text-center py-12">
			<p class="text-muted">{$LL.fleet_empty_desc()}</p>
		</div>
	{/if}
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
