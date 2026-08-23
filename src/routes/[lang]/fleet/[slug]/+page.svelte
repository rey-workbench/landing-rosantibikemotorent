<script lang="ts">
import { onDestroy, onMount, untrack } from 'svelte';
import { goto, refreshAll } from '$app/navigation';
import { page as pageStore } from '$app/state';
import { LL } from '$i18n/i18n-svelte';
import { SeoHead } from '$lib/components/seo';
import Button from '$lib/components/ui/Button.svelte';
import { buildBreadcrumbSchema, buildProductSchema } from '$lib/seo/schema';
import { websocketService } from '$lib/services/websocket';
import { getMotorImage, handleImageError } from '$lib/utils/image';

let { data } = $props();
let motor = $state(untrack(() => data.motor));

$effect(() => {
	motor = data.motor;
});

let unsubs: (() => void)[] = [];

let jenis = $derived(motor?.jenisMotor);
let displayPrice = $derived(jenis?.hargaSewa || 0);
let lang = $derived((pageStore.params.lang || 'id') as 'id' | 'en');
let currentUrl = $derived(pageStore.url.href);

onMount(() => {
	websocketService.connect();

	unsubs = [
		websocketService.onTransactionUpdate(() => refreshAll()),
		websocketService.onUnitMotorUpdate(() => refreshAll())
	];
});

onDestroy(() => {
	for (const unsub of unsubs) {
		unsub();
	}
});

function handleBooking() {
	if (motor) {
		goto(`/${lang}/booking?unitId=${motor.id}`);
	}
}

let productSchema = $derived(
	motor && jenis
		? buildProductSchema({
				name: `${jenis.merk} ${jenis.model}`,
				description: $LL.fleet_detail_description({
					merk: jenis.merk,
					model: jenis.model,
					cc: jenis.cc
				}),
				brand: jenis.merk,
				image: getMotorImage(jenis) || jenis.gambar,
				sku: motor.id || '',
				price: displayPrice,
				inStock: true,
				url: currentUrl
			})
		: null
);

let breadcrumbSchema = $derived(
	motor && jenis
		? buildBreadcrumbSchema([
				{ position: 1, name: 'Home', item: `https://rosantibikemotorent.com/${lang}` },
				{ position: 2, name: 'Fleet', item: `https://rosantibikemotorent.com/${lang}/fleet` },
				{ position: 3, name: `${jenis.merk} ${jenis.model}`, item: currentUrl }
			])
		: null
);

let schemas = $derived([productSchema, breadcrumbSchema].filter(Boolean) as object[]);
</script>

{#if motor && jenis}
	<SeoHead
		{lang}
		meta={{
			title: `Sewa Motor ${jenis.merk} ${jenis.model} di Malang | Rosantibike`,
			description: $LL.fleet_detail_description({
				merk: jenis.merk,
				model: jenis.model,
				cc: jenis.cc
			}),
			ogType: 'product',
			ogImage: getMotorImage(jenis) || jenis.gambar,
			canonicalUrl: currentUrl
		}}
		{schemas}
	/>
{:else}
	<SeoHead
		{lang}
		meta={{
			title: `${$LL.page_title_fleet_detail()} | Rosantibike Motorent`
		}}
	/>
{/if}

<svelte:head>
	{#if jenis && (getMotorImage(jenis) || jenis.gambar)}
		<link
			rel="preload"
			as="image"
			href={getMotorImage(jenis) || jenis.gambar}
			fetchpriority="high"
		/>
	{/if}
</svelte:head>

<!-- Back Button -->
<div class="pt-18 md:pt-20 px-4 md:px-10">
	<div class="max-w-7xl mx-auto">
		<a
			href="/{lang}/fleet"
			class="inline-flex items-center gap-2 text-apple-blue text-[15px] font-medium transition-colors hover:underline"
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
	<section class="pt-4 pb-16 px-4 md:px-10">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<!-- Image Section -->
				<div class="relative">
					<div class="aspect-4/3 rounded-4xl overflow-hidden bg-[#f5f5f7] border border-black/5">
						{#if getMotorImage(jenis)}
							<img
								loading="eager"
								fetchpriority="high"
								decoding="async"
								width="800"
								height="600"
								src={getMotorImage(jenis)}
								onerror={handleImageError}
								alt={`Sewa Motor ${jenis.merk} ${jenis.model} Malang - Rosantibike`}
								class="w-full h-full object-cover mix-blend-multiply"
							/>
						{:else}
							<div class="w-full h-full flex items-center justify-center text-[#6b6b70]">
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
				</div>

				<!-- Details Section -->
				<div class="flex flex-col justify-center">
					<!-- Breadcrumb -->
					<p class="text-apple-blue font-semibold text-[13px] uppercase tracking-wider mb-2">
						{jenis.merk}
					</p>

					<h1
						class="text-[36px] md:text-[44px] leading-[1.05] font-semibold font-display text-[#1d1d1f] tracking-tight mb-6"
					>
						Sewa Motor {jenis.model} Malang
					</h1>

					<p class="text-[#6b6b70] text-[17px] leading-relaxed mb-8">
						{$LL.fleet_detail_description({ merk: jenis.merk, model: jenis.model, cc: jenis.cc })}
					</p>

					<!-- Specs Grid (Apple Clean Surfaces) -->
					<div class="grid grid-cols-2 gap-4 mb-8">
						<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-5">
							<p class="text-[#525257] text-[12px] font-semibold uppercase tracking-wider mb-1">
								{$LL.fleet_detail_engine()}
							</p>
							<p class="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
								{jenis.cc}
								<span class="text-base text-[#525257] font-medium tracking-normal">CC</span>
							</p>
						</div>
						<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-5">
							<p class="text-[#525257] text-[12px] font-semibold uppercase tracking-wider mb-1">
								{$LL.fleet_detail_year()}
							</p>
							<p class="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
								{motor.tahunPembuatan || '2023+'}
							</p>
						</div>
					</div>

					<!-- Price & Booking -->
					<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-8">
						<div class="flex items-end justify-between mb-6">
							<div>
								<p class="text-[#525257] text-[13px] font-semibold uppercase tracking-wider mb-1">
									{$LL.fleet_detail_price()}
								</p>
								<p class="text-[40px] leading-none font-semibold text-[#1d1d1f] tracking-tight">
									{$LL.format_currency(displayPrice)}
								</p>
								<p class="text-[#525257] text-[15px] mt-1 font-medium">
									{$LL.fleet_detail_per_day()}
								</p>
							</div>
						</div>

						<Button
							onclick={handleBooking}
							variant="primary"
							size="lg"
							className="w-full text-[17px] py-4">{$LL.fleet_detail_book_now()}</Button
						>

						<p class="text-center text-[#525257] text-sm mt-4">
							{$LL.fleet_detail_contact_whatsapp()}
						</p>
					</div>
				</div>
			</div>

			<!-- Additional Info -->
			<div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
				<div class="bg-white border border-black/5 rounded-3xl p-8 shadow-xs">
					<div
						class="w-12 h-12 bg-blue-50 text-apple-blue rounded-xl flex items-center justify-center mb-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-[#1d1d1f] mb-2 font-display">
						{$LL.fleet_detail_insurance()}
					</h2>
					<p class="text-[#525257] leading-relaxed text-sm">
						{$LL.fleet_detail_insurance_desc()}
					</p>
				</div>

				<div class="bg-white border border-black/5 rounded-3xl p-8 shadow-xs">
					<div
						class="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-[#1d1d1f] mb-2 font-display">
						{$LL.fleet_detail_well_maintained()}
					</h2>
					<p class="text-[#525257] leading-relaxed text-sm">
						{$LL.fleet_detail_well_maintained_desc()}
					</p>
				</div>

				<div class="bg-white border border-black/5 rounded-3xl p-8 shadow-xs">
					<div
						class="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-[#1d1d1f] mb-2 font-display">
						{$LL.fleet_detail_support()}
					</h2>
					<p class="text-[#525257] leading-relaxed text-sm">
						{$LL.fleet_detail_support_desc()}
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}
