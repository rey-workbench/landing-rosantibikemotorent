<script lang="ts">
	import { onMount } from 'svelte';
	import { siteConfig } from '$lib/config';

	let { lang = 'id' }: { lang?: 'id' | 'en' } = $props();

	let visible = $state(false);
	let pickupDate = $state('');
	let duration = $state('1');

	onMount(() => {
		const handleScroll = () => {
			visible = window.scrollY > 400;
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function handleBook() {
		const message = lang === 'en'
			? `Hello, I would like to book a motorcycle starting on ${pickupDate || 'today'} for ${duration} days.`
			: `Halo, saya ingin memesan motor mulai tanggal ${pickupDate || 'hari ini'} untuk durasi ${duration} hari.`;
		
		const href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
		window.open(href, '_blank');
	}
</script>

{#if visible}
	<div
		class="fixed bottom-0 left-0 right-0 z-50 p-4 md:px-10 bg-black/80 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all duration-500 ease-in-out transform translate-y-0"
	>
		<div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
			<!-- Info/Benefit -->
			<div class="hidden lg:flex flex-col text-left">
				<span class="text-xs font-mono text-brand-highlight font-bold uppercase tracking-widest">
					{lang === 'en' ? 'Reserve Now • Pay at Pickup' : 'Pesan Sekarang • Bayar Saat Ambil'}
				</span>
				<span class="text-sm font-bold text-white uppercase mt-0.5">
					{lang === 'en' ? 'Malang Premium Motor Rental' : 'Sewa Motor Premium Malang'}
				</span>
			</div>

			<!-- Form widget -->
			<div class="w-full md:w-auto flex flex-wrap md:flex-nowrap items-center gap-3 flex-1 justify-center md:justify-end">
				<!-- Date Picker -->
				<div class="flex flex-col items-start gap-1 w-[48%] md:w-48">
					<label for="pickup" class="text-[9px] uppercase tracking-wider text-white/50 font-bold font-mono">
						{lang === 'en' ? 'Pickup Date' : 'Tanggal Mulai'}
					</label>
					<input
						type="date"
						id="pickup"
						bind:value={pickupDate}
						class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-highlight font-mono"
					/>
				</div>

				<!-- Duration select -->
				<div class="flex flex-col items-start gap-1 w-[48%] md:w-32">
					<label for="duration" class="text-[9px] uppercase tracking-wider text-white/50 font-bold font-mono">
						{lang === 'en' ? 'Duration' : 'Durasi'}
					</label>
					<select
						id="duration"
						bind:value={duration}
						class="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-highlight font-mono appearance-none"
					>
						{[1, 2, 3, 4, 5, 6, 7, 10, 14, 30].map(day => `
							<option value="${day}" class="bg-neutral-900 text-white">
								${day} ${lang === 'en' ? (day > 1 ? 'Days' : 'Day') : 'Hari'}
							</option>
						`).join('')}
					</select>
				</div>

				<!-- CTA button -->
				<button
					onclick={handleBook}
					class="w-full md:w-auto px-8 py-3 bg-brand-highlight hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-brand-highlight/20 mt-4 md:mt-0"
				>
					{lang === 'en' ? 'Book Now' : 'Pesan Sekarang'}
				</button>
			</div>
		</div>
	</div>
{/if}
