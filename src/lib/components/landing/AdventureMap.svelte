<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let scrollProgress = 0;
	let containerRef: HTMLElement;

	// Spot-spot Ikonik Malang sesuai rute petualangan
	const spots = [
		{
			name: 'Kayutangan Heritage',
			coords: 'Lat -7.9774, Lon 112.6288',
			desc: 'Menyusuri jejak sejarah Malang di kawasan kolonial yang estetik.',
			trigger: 0.1
		},
		{
			name: 'Batu Paragliding',
			coords: 'Lat -7.8924, Lon 112.5052',
			desc: 'Menikmati city light dari ketinggian Gunung Banyak.',
			trigger: 0.35
		},
		{
			name: 'Coban Sewu',
			coords: 'Lat -8.2255, Lon 112.9179',
			desc: 'Keajaiban air terjun seribu yang tersembunyi di balik hutan.',
			trigger: 0.6
		},
		{
			name: 'Breathtaking Bromo',
			coords: 'Lat -7.9425, Lon 112.9530',
			desc: 'Menjemput fajar di lautan pasir yang legendaris.',
			trigger: 0.85
		}
	];

	let activeSpotIndex = -1;

	onMount(() => {
		const handleScroll = () => {
			if (!containerRef) return;
			const rect = containerRef.getBoundingClientRect();
			const startY = rect.top;
			const height = rect.height;
			const viewportHeight = window.innerHeight;

			const progressRaw = -startY / (height - viewportHeight);
			scrollProgress = Math.max(0, Math.min(1, progressRaw));

			// Logic untuk memicu label tempat
			activeSpotIndex = spots.findLastIndex((s) => scrollProgress >= s.trigger);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div class="bg-brand-dark py-20 relative overflow-hidden" bind:this={containerRef}>
	<div class="h-[300vh] relative">
		<div
			class="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden"
		>
			<!-- THE INFINITE MAP (Placeholder) -->
			<!-- Di masa depan, ini bisa diganti dengan <canvas> sequence Anda -->
			<div
				class="absolute inset-0 opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
				style="
					background-image: url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i3255!3i2134!2m3!1e0!2sm!3i665123984!3m17!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m3!1e12!2m1!1s1!4e0!5m1!5f2');
					background-size: 250%;
					background-position: {50 + scrollProgress * 20}% {50 + scrollProgress * 20}%;
					transform: scale({1 + scrollProgress * 0.5}) rotate({scrollProgress * 5}deg);
				"
			></div>

			<!-- Scanline Effect (Futuristic) -->
			<div
				class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"
			></div>

			<!-- UI HUD Elements -->
			<div
				class="absolute inset-0 pointer-events-none flex flex-col justify-between p-10 md:p-20 border border-white/5 m-4 md:m-10 rounded-[3rem]"
			>
				<div class="flex justify-between items-start">
					<div class="space-y-2">
						<h2 class="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase">
							Navigation System
						</h2>
						<h3 class="text-white text-3xl font-black uppercase tracking-tighter">
							Explore Without Limits
						</h3>
					</div>
					<div
						class="text-right font-mono text-[10px] text-white/40 uppercase tracking-widest leading-relaxed"
					>
						Status: Tracking Active<br />
						Signal: 5/5 Solid<br />
						Mode: Adventure
					</div>
				</div>

				<!-- Bike Floating Placeholder -->
				<div class="relative w-64 h-64 flex items-center justify-center">
					<div
						class="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full animate-pulse"
					></div>
					<!-- Di sini nanti sequence motor Anda diletakkan -->
					<div
						class="relative z-10 transform scale-125 md:scale-150 rotate-[25deg] transition-transform duration-500"
					>
						<svg
							width="200"
							height="200"
							viewBox="0 0 24 24"
							fill="none"
							class="text-white/20 active:text-blue-500 transition-colors"
						>
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
								fill="currentColor"
							/>
							<circle cx="12" cy="12" r="3" fill="currentColor" />
						</svg>
						<div
							class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] text-white opacity-40 uppercase tracking-tighter text-center"
						>
							Sequence<br />Placeholder
						</div>
					</div>
				</div>

				<div class="flex justify-between items-end border-t border-white/10 pt-8">
					<div class="space-y-4 max-w-sm">
						{#each spots as spot, i}
							{#if i === activeSpotIndex}
								<div in:fly={{ x: -20, opacity: 0 }} out:fade class="space-y-1">
									<p class="text-blue-400 font-mono text-[10px] tracking-widest">{spot.coords}</p>
									<h4 class="text-white text-xl font-bold uppercase">{spot.name}</h4>
									<p class="text-gray-500 text-sm leading-relaxed">{spot.desc}</p>
								</div>
							{/if}
						{/each}
					</div>
					<div class="flex flex-col items-end gap-2">
						<div class="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
							Distance Traveled
						</div>
						<div class="text-4xl font-bold text-white font-mono tabular-nums">
							{(scrollProgress * 25).toFixed(1)}
							<span class="text-sm font-normal text-blue-500">KM</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Dynamic Map Marker -->
			<div
				class="absolute w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center"
				style="transform: translate(-50%, -50%); transition: all 0.5s ease-out;"
			>
				<div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Animasi tambahan jika diperlukan */
</style>
