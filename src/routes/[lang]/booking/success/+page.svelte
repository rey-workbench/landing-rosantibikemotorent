<script lang="ts">
import { page } from '$app/state';
import { LL } from '$i18n/i18n-svelte';
import { SeoHead } from '$lib/components/seo';
import Button from '$lib/components/ui/Button.svelte';
import { siteConfig } from '$lib/config';

let { data } = $props();
let transaksi = $derived(data.transaksi);
let lang = $derived((page.params.lang || 'id') as 'id' | 'en');
let currentUrl = $derived(page.url.href);
</script>

<SeoHead
	{lang}
	meta={{
		title: `${$LL.page_title_booking_success()} | Rosantibike Motorent`,
		robots: 'noindex, nofollow',
		canonicalUrl: currentUrl
	}}
/>

<main class="pt-20 md:pt-24 pb-20 px-4 sm:px-6 md:px-8 bg-white min-h-screen">
	<div class="max-w-2xl mx-auto text-center">
		{#if transaksi}
			<!-- Success Header -->
			<div class="mb-10">
				<div
					class="w-20 h-20 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="text-green-500"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				</div>
				<h1
					class="text-[32px] md:text-[40px] font-semibold font-display text-[#1d1d1f] tracking-tight mb-3"
				>
					{$LL.booking_success_title()}
				</h1>
				<p class="text-[#6b6b70] text-[15px] sm:text-[17px] leading-relaxed">
					{$LL.booking_success_subtitle()}
				</p>
			</div>

			<!-- Booking Details -->
			<div
				class="bg-white border border-black/5 rounded-3xl p-6 sm:p-8 text-left mb-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
			>
				<h3 class="text-[17px] font-semibold text-[#1d1d1f] mb-6 flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="text-apple-blue"
					>
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
						<line x1="16" y1="13" x2="8" y2="13" />
						<line x1="16" y1="17" x2="8" y2="17" />
						<polyline points="10 9 9 9 8 9" />
					</svg>
					{$LL.booking_success_detail_title()}
				</h3>

				<div class="space-y-3 text-xs sm:text-sm">
					<div class="flex justify-between items-center py-2.5 border-b border-black/5">
						<span class="text-[#6b6b70]">{$LL.booking_success_renter_name()}</span>
						<span class="text-[#1d1d1f] font-medium">{transaksi.namaPenyewa}</span>
					</div>
					<div class="flex justify-between items-center py-2.5 border-b border-black/5">
						<span class="text-[#6b6b70]">{$LL.booking_whatsapp_label()}</span>
						<span class="text-[#1d1d1f] font-medium">{transaksi.noWhatsapp}</span>
					</div>
					<div class="flex justify-between items-center py-2.5 border-b border-black/5">
						<span class="text-[#6b6b70]">{$LL.booking_start_date_label()}</span>
						<span class="text-[#1d1d1f] font-medium"
							>{transaksi.tanggalMulai
								? `${$LL.format_date_long(new Date(transaksi.tanggalMulai))} • ${transaksi.jamMulai}`
								: '-'}</span
						>
					</div>
					<div class="flex justify-between items-center py-2.5 border-b border-black/5">
						<span class="text-[#6b6b70]">{$LL.booking_end_date_label()}</span>
						<span class="text-[#1d1d1f] font-medium"
							>{transaksi.tanggalSelesai
								? `${$LL.format_date_long(new Date(transaksi.tanggalSelesai))} • ${transaksi.jamSelesai}`
								: '-'}</span
						>
					</div>
					{#if transaksi.jasHujan > 0}
						<div class="flex justify-between items-center py-2.5 border-b border-black/5">
							<span class="text-[#6b6b70]">{$LL.booking_raincoat_field()}</span>
							<span class="text-apple-blue font-medium"
								>{transaksi.jasHujan} {$LL.booking_confirm_pieces()}</span
							>
						</div>
					{/if}
					{#if transaksi.helm > 0}
						<div class="flex justify-between items-center py-2.5 border-b border-black/5">
							<span class="text-[#6b6b70]">{$LL.booking_helmet_field()}</span>
							<span class="text-apple-blue font-medium"
								>{transaksi.helm} {$LL.booking_confirm_pieces()}</span
							>
						</div>
					{/if}
					<div class="flex justify-between items-center py-3 pt-4">
						<span class="text-xs font-semibold text-[#6b6b70] tracking-wider uppercase"
							>{$LL.booking_total_cost()}</span
						>
						<span class="text-2xl sm:text-3xl font-bold text-[#1d1d1f]"
							>{$LL.format_currency(transaksi.totalBiaya)}</span
						>
					</div>
				</div>
			</div>

			<!-- Status Badge -->
			<div
				class="bg-[#fef9c3] border border-yellow-300 rounded-2xl p-4 sm:p-5 mb-8 text-[#854d0e] text-xs sm:text-sm"
			>
				<div class="flex items-center justify-center gap-2.5">
					<div class="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shadow-xs"></div>
					<span class="font-semibold uppercase tracking-wider text-xs">
						{$LL.booking_success_status()}: {transaksi.status}
					</span>
				</div>
				<p class="mt-1.5 opacity-90 font-medium">{$LL.booking_success_pending()}</p>
			</div>

			<!-- WhatsApp CTA -->
			<Button
				variant="primary"
				size="lg"
				href="https://wa.me/{siteConfig.whatsapp}?text={encodeURIComponent(
					$LL.booking_success_whatsapp_message({
						id: transaksi.id
					})
				)}"
				className="w-full flex items-center justify-center gap-2"
			>
				<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
					<path
						d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
					/>
				</svg>
				{$LL.booking_success_whatsapp_cta()}
			</Button>

			<div class="mt-8">
				<a
					href="/{lang}/"
					class="inline-flex items-center gap-2 text-apple-blue hover:underline font-medium transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					{$LL.booking_success_back_home()}
				</a>
			</div>
		{/if}
	</div>
</main>
