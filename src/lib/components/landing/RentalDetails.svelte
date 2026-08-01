<script lang="ts">
	import { LL } from '$i18n/i18n-svelte';
	let { lang }: { lang?: string } = $props();

	// Split requirements list by semicolon
	const reqList = $derived($LL.details_reqs_list().split(';'));

	const pricingMatrix = [
		{
			type: 'Yamaha Soul GT',
			capacity: '125 cc',
			rate: 'Rp 80.000',
			route: 'Dalam Kota Malang & Batu'
		},
		{
			type: 'Honda Vario 150',
			capacity: '150 cc',
			rate: 'Rp 120.000',
			route: 'Malang, Batu, & Pegunungan'
		},
		{
			type: 'Yamaha Lexi',
			capacity: '125 cc',
			rate: 'Rp 125.000',
			route: 'Tour Santai Kota & Kuliner'
		},
		{
			type: 'Honda PCX 160',
			capacity: '160 cc',
			rate: 'Rp 150.000',
			route: 'Long Trip / Bromo Tour'
		}
	];

	const locations = [
		{ name: 'Stasiun Malang (Kota Baru)', desc: 'Gratis delivery & pickup dekat pintu stasiun utama.' },
		{ name: 'Terminal Arjosari', desc: 'Pengantaran armada langsung ke terminal bus Malang.' },
		{ name: 'Universitas Brawijaya (UB)', desc: 'Layanan antar jemput cepat ke area kampus.' },
		{ name: 'Kota Wisata Batu', desc: 'Titik awal perjalanan wisata keluarga.' },
		{ name: 'Gunung Bromo & Tumpak Sewu', desc: 'Konsultasikan rute pegunungan dengan armada khusus.' }
	];
</script>

<section class="py-24 md:py-36 relative bg-white z-20 border-t border-black/5">
	<div class="container mx-auto px-6 md:px-10 max-w-7xl">
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto mb-16 md:mb-24">
			<h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-4">
				{$LL.details_title()}
			</h2>
			<p class="text-lg md:text-xl text-[#86868b] leading-relaxed font-normal">
				{$LL.details_subtitle()}
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
			<!-- Table / Pricing Matrix (Takes 2 cols on desktop) -->
			<div class="lg:col-span-2 space-y-6">
				<h2 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
					{$LL.details_pricing_title()}
				</h2>
				<div class="overflow-x-auto rounded-3xl border border-black/5 bg-[#f5f5f7] p-4 sm:p-6">
					<table class="w-full text-left border-collapse min-w-150">
						<thead>
							<tr class="border-b border-black/10 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
								<th class="py-4 px-4">{$LL.details_pricing_col_type()}</th>
								<th class="py-4 px-4">Kapasitas Mesin</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_rate()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_inclusions()}</th>
								<th class="py-4 px-4">Peruntukan Rute</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-black/5 text-[#1d1d1f]">
							{#each pricingMatrix as item}
								<tr class="transition-colors hover:bg-black/2">
									<td class="py-5 px-4 font-semibold">
										<h3 class="text-sm font-bold m-0 p-0 text-[#1d1d1f]">{item.type}</h3>
									</td>
									<td class="py-5 px-4 text-sm font-medium">{item.capacity}</td>
									<td class="py-5 px-4 font-bold text-[#0071e3] whitespace-nowrap">{item.rate}</td>
									<td class="py-5 px-4 text-sm text-[#86868b]">{$LL.details_pricing_inclusions()}</td>
									<td class="py-5 px-4 text-sm font-medium">{item.route}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Requirements & Locations (Takes 1 col on desktop) -->
			<div class="space-y-12">
				<!-- Requirements -->
				<div class="space-y-6">
					<h2 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
						{$LL.details_reqs_title()}
					</h2>
					<ul class="space-y-4">
						{#each reqList as req}
							<li class="flex items-start gap-3 text-base text-[#1d1d1f]">
								<span class="shrink-0 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold text-[#86868b] mt-0.5">
									✓
								</span>
								<span class="leading-relaxed">{req}</span>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Locations -->
				<div class="space-y-6">
					<h2 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
						{$LL.details_area_title()}
					</h2>
					<p class="text-sm text-[#86868b]">
						{$LL.details_area_desc()}
					</p>
					<div class="space-y-4">
						{#each locations as loc}
							<div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/5 hover:border-black/10 transition-colors">
								<h4 class="font-bold text-[#1d1d1f] text-sm">{loc.name}</h4>
								<p class="text-xs text-[#86868b] mt-1">{loc.desc}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>