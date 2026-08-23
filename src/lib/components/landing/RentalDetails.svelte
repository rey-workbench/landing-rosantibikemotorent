<script lang="ts">
import { LL } from '$i18n/i18n-svelte';

let { lang: _lang }: { lang?: string } = $props();

// Split requirements list by semicolon
const reqList = $derived($LL.details_reqs_list().split(';'));

const pricingMatrix = $derived([
	{
		type: 'Yamaha Soul GT',
		capacity: '125 cc',
		rate: 'Rp 80.000',
		route: $LL.route_city()
	},
	{
		type: 'Honda Vario 150',
		capacity: '150 cc',
		rate: 'Rp 120.000',
		route: $LL.route_all()
	},
	{
		type: 'Yamaha Lexi',
		capacity: '125 cc',
		rate: 'Rp 125.000',
		route: $LL.route_all()
	},
	{
		type: 'Honda PCX 160',
		capacity: '160 cc',
		rate: 'Rp 150.000',
		route: $LL.route_all()
	}
]);

const locations = $derived([
	{ name: $LL.loc_stasiun_name(), desc: $LL.loc_stasiun_desc() },
	{ name: $LL.loc_terminal_name(), desc: $LL.loc_terminal_desc() },
	{ name: $LL.loc_ub_name(), desc: $LL.loc_ub_desc() },
	{ name: $LL.loc_batu_name(), desc: $LL.loc_batu_desc() },
	{ name: $LL.loc_bromo_name(), desc: $LL.loc_bromo_desc() }
]);
</script>

<section class="py-24 md:py-36 relative bg-white z-20 border-t border-black/5">
	<div class="container mx-auto px-6 md:px-10 max-w-7xl">
		<!-- Section Header -->
		<div class="text-center max-w-3xl mx-auto mb-16 md:mb-24">
			<h2
				class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-4"
			>
				{$LL.details_title()}
			</h2>
			<p class="text-lg md:text-xl text-[#6b6b70] leading-relaxed font-normal">
				{$LL.details_subtitle()}
			</p>
		</div>

		<div class="space-y-16 lg:space-y-24">
			<!-- Table / Pricing Matrix (Full Width) -->
			<div class="space-y-6">
				<h3 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
					{$LL.details_pricing_title()}
				</h3>
				<div class="overflow-x-auto rounded-3xl border border-black/5 bg-[#f5f5f7] p-4 sm:p-6">
					<table class="w-full text-left border-collapse min-w-200">
						<thead>
							<tr
								class="border-b border-black/10 text-xs font-semibold uppercase tracking-wider text-[#6b6b70]"
							>
								<th class="py-4 px-4">{$LL.details_pricing_col_type()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_capacity()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_rate()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_inclusions()}</th>
								<th class="py-4 px-4">{$LL.details_pricing_col_route()}</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-black/5 text-[#1d1d1f]">
							{#each pricingMatrix as item}
								<tr class="transition-colors hover:bg-black/2">
									<td class="py-5 px-4 font-semibold">
										{item.type}
									</td>
									<td class="py-5 px-4 text-[#6e6e73] font-medium">{item.capacity}</td>
									<td class="py-5 px-4 font-bold text-[#1d1d1f]">{item.rate}</td>
									<td class="py-5 px-4 text-xs font-medium text-[#1d1d1f]">
										{$LL.details_pricing_inclusions()}
									</td>
									<td class="py-5 px-4">
										<span
											class="inline-block px-3 py-1 bg-white border border-black/8 rounded-full text-xs font-medium text-[#1d1d1f]"
										>
											{item.route}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Requirements & Locations (Side by side on desktop) -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
				<!-- Requirements -->
				<div class="space-y-6">
					<h3 class="text-2xl font-bold text-[#1d1d1f] tracking-tight">
						{$LL.details_reqs_title()}
					</h3>
					<ul class="space-y-4">
						{#each reqList as req}
							<li class="flex items-start gap-3 text-base text-[#1d1d1f]">
								<span
									class="shrink-0 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold text-[#1d1d1f] mt-0.5"
								>
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
					<p class="text-sm text-[#6e6e73]">
						{$LL.details_area_desc()}
					</p>
					<div class="space-y-3">
						{#each locations as loc}
							<div
								class="p-4.5 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-start gap-3.5 transition-all hover:bg-[#e8e8ed]"
							>
								<div
									class="w-8 h-8 rounded-full bg-white text-apple-blue border border-black/5 flex items-center justify-center shrink-0 shadow-2xs mt-0.5"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
								<div>
									<h4 class="font-bold text-[#1d1d1f] text-sm">{loc.name}</h4>
									<p class="text-xs text-[#6e6e73] mt-0.5 leading-relaxed">{loc.desc}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
