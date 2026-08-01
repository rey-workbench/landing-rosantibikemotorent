<script lang="ts">
	import { LL } from '$i18n/i18n-svelte';

	// Split requirements list by semicolon
	const reqList = $derived($LL.details_reqs_list().split(';'));

	const pricingMatrix = [
		{
			type: 'Matic Standar (110cc - 125cc)',
			models: 'Honda Beat, Honda Scoopy, Yamaha Fazzio, Honda Vario 125',
			rate: 'Rp 80.000 - Rp 95.000'
		},
		{
			type: 'Matic Premium / Maxi (150cc - 160cc)',
			models: 'Honda PCX 160, Yamaha NMAX, Yamaha Aerox, Honda Vario 160',
			rate: 'Rp 110.000 - Rp 135.000'
		},
		{
			type: 'Sport & Maxi Premium',
			models: 'Vespa Sprint 150, Honda ADV 160, Kawasaki W175',
			rate: 'Rp 140.000 - Rp 150.000'
		}
	];

	const locations = [
		{ name: 'Stasiun Malang (Kota Baru)', desc: 'Gratis delivery & pickup dekat pintu stasiun utama.' },
		{ name: 'Purwantoro / Bauksit Hub', desc: 'Lokasi garasi utama dekat pusat perkantoran Malang.' },
		{ name: 'Universitas Brawijaya (UB) & UM', desc: 'Layanan antar jemput cepat ke area kampus.' },
		{ name: 'Terminal Arjosari', desc: 'Pengantaran armada langsung ke terminal bus Malang.' },
		{ name: 'Rute Wisata Kota Batu', desc: 'Titik awal perjalanan ke Batu, Bromo & sekitarnya.' }
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
				<h3 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
					{$LL.details_pricing_title()}
				</h3>
				<div class="overflow-x-auto rounded-3xl border border-black/5 bg-[#f5f5f7] p-4 sm:p-6">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="border-b border-black/10 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
								<th class="py-4 px-4">{$LL.details_pricing_col_type()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_rate()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_inclusions()}</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-black/5 text-[#1d1d1f]">
							{#each pricingMatrix as item}
								<tr class="transition-colors hover:bg-black/2">
									<td class="py-5 px-4 font-semibold">
										{item.type}
										<span class="block text-xs font-normal text-[#86868b] mt-1">{item.models}</span>
									</td>
									<td class="py-5 px-4 font-bold text-[#0071e3] whitespace-nowrap">{item.rate} <span class="text-xs font-normal text-[#86868b]">/ hari</span></td>
									<td class="py-5 px-4 text-sm text-[#86868b]">{$LL.details_pricing_inclusions()}</td>
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
					<h3 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
						{$LL.details_reqs_title()}
					</h3>
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
					<h3 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
						{$LL.details_area_title()}
					</h3>
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