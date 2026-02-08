<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let scrollProgress = 0;
	let containerRef: HTMLElement;
	let activePanelIndex = 0;

	const panels = [
		{
			id: 'nature',
			title: 'Wisata Alam',
			subtitle: 'Lupakan Rutinitas',
			description:
				'Berkendara melintasi hutan dan jalur pegunungan yang menakjubkan. Rasakan angin, rengkuh alam liar.',
			video: '/video/ts.mp4',
			accentColor: '#4ade80',
			gradientFrom: 'from-emerald-900/60'
		},
		{
			id: 'city',
			title: 'Denyut Kota',
			subtitle: 'Cahaya & Malam Kota',
			description:
				'Jelajahi jalanan yang hidup dan temukan permata tersembunyi di setiap sudut kota.',
			video: '/video/mbd.mp4',
			accentColor: '#60a5fa',
			gradientFrom: 'from-blue-900/60'
		},
		{
			id: 'coast',
			title: 'Suasana Pantai',
			subtitle: 'Mentari, Pasir & Motor',
			description:
				'Kejar cakrawala di sepanjang garis pantai yang memukau. Dimana jalan bertemu dengan laut.',
			video: '/video/ptb.mp4',
			accentColor: '#fb923c',
			gradientFrom: 'from-orange-900/60'
		}
	];

	// Video refs
	let videoRefs: HTMLVideoElement[] = [];

	// Update active panel and handle video playback
	$: {
		activePanelIndex = Math.min(panels.length - 1, Math.floor(scrollProgress * panels.length));

		if (typeof window !== 'undefined') {
			videoRefs.forEach((video, idx) => {
				if (video) {
					if (idx === activePanelIndex) {
						if (video.paused) {
							video.play().catch((err) => console.log('Video play failed:', err));
						}
					} else {
						if (!video.paused) {
							video.pause();
						}
					}
				}
			});
		}
	}

	onMount(() => {
		const handleScroll = () => {
			if (!containerRef) return;
			const rect = containerRef.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const totalHeight = rect.height - viewportHeight;

			const raw = -rect.top / totalHeight;
			scrollProgress = Math.max(0, Math.min(0.999, raw));
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial check

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="bg-black relative" bind:this={containerRef}>
	<!-- Extended Height for Sequential Scroll -->
	<div class="h-[500vh] relative">
		<!-- Section Header -->
		<div class="sticky top-0 z-10 pointer-events-none">
			<div class="absolute top-8 left-1/2 -translate-x-1/2 text-center w-full px-4">
				<h2
					class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center justify-center gap-2"
				>
					<span class="w-8 h-[1px] bg-blue-500"></span>
					Pilih Petualanganmu
					<span class="w-8 h-[1px] bg-blue-500"></span>
				</h2>
				<h3
					class="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
				>
					Tiga Jalur, <br />
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600"
					>
						Satu Perjalanan.
					</span>
				</h3>
			</div>
		</div>

		<!-- Sticky Viewport -->
		<div
			class="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row bg-black"
			style="perspective: 1000px;"
		>
			{#each panels as panel, i}
				<div
					class="panel relative w-full md:w-auto md:h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden border-r border-white/10 last:border-r-0"
					style="
						z-index: {i === activePanelIndex ? 10 : i};
						flex: {i === activePanelIndex ? '3' : '1'};
						filter: {typeof window !== 'undefined' && window.innerWidth >= 768
						? i === activePanelIndex
							? 'saturate(1.2) contrast(1.05)'
							: 'saturate(0.3) brightness(0.6)'
						: 'none'};
					"
				>
					<!-- Video Layer with Zoom -->
					<div
						class="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-out"
						style="transform: scale({i === activePanelIndex ? 1.0 : 1.2})"
					>
						<video
							bind:this={videoRefs[i]}
							src={panel.video}
							class="w-full h-full object-cover"
							muted
							loop
							playsinline
						></video>
						<div class="absolute inset-0 bg-black/50 pointer-events-none"></div>
					</div>

					<!-- Color Overlay -->
					<div
						class="absolute inset-0 transition-opacity duration-700"
						style="
							background: linear-gradient(to top, {panel.accentColor}20, transparent 50%);
							opacity: {i === activePanelIndex ? 1 : 0};
						"
					></div>

					<!-- Gradient Overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-t {panel.gradientFrom} via-transparent to-black/20"
					></div>

					<!-- Animated Lines -->
					<div class="absolute inset-0 overflow-hidden pointer-events-none">
						<div
							class="absolute left-4 md:left-8 top-0 bottom-0 w-px transition-all duration-1000"
							style="
								background: linear-gradient(to bottom, transparent, {panel.accentColor}40, transparent);
								opacity: {i === activePanelIndex ? 1 : 0.2};
							"
						></div>
						<div
							class="absolute left-4 md:left-8 top-1/2 w-16 h-px transition-all duration-700 delay-200"
							style="
								background: {panel.accentColor};
								transform: translateX({i === activePanelIndex ? '0' : '-100%'});
								opacity: {i === activePanelIndex ? 1 : 0};
							"
						></div>
					</div>

					<!-- Panel Number -->
					<div
						class="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 transition-all duration-700"
						style="opacity: {i === activePanelIndex ? 1 : 0.1}"
					>
						<span
							class="font-mono text-[80px] md:text-[120px] lg:text-[180px] font-black leading-none"
							style="
								color: transparent;
								-webkit-text-stroke: 1px {panel.accentColor}60;
							"
						>
							0{i + 1}
						</span>
					</div>

					<!-- Content Overlay -->
					<div class="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-end">
						<div
							class="transition-all duration-700 ease-out"
							style="
								transform: translateY({i === activePanelIndex ? '0' : '40px'});
								opacity: {i === activePanelIndex ? 1 : 0};
							"
						>
							<!-- Subtitle -->
							<div class="flex items-center gap-3 mb-2 md:mb-3">
								<div
									class="h-px w-6 md:w-8 transition-all duration-500"
									style="background: {panel.accentColor}"
								></div>
								<p
									class="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase"
									style="color: {panel.accentColor}"
								>
									{panel.subtitle}
								</p>
							</div>

							<!-- Title -->
							<h3
								class="text-white text-3xl md:text-4xl lg:text-7xl font-black uppercase leading-[0.85] tracking-tight mb-2 md:mb-4"
							>
								{panel.title}
							</h3>

							<!-- Description -->
							<div
								class="overflow-hidden transition-all duration-700 delay-100"
								style="max-height: {i === activePanelIndex ? '120px' : '0px'}"
							>
								<p class="text-white/70 text-base md:text-lg max-w-md leading-relaxed font-light">
									{panel.description}
								</p>
							</div>

							<!-- CTA Button -->
							<div
								class="mt-6 transition-all duration-500 delay-300"
								style="
									opacity: {i === activePanelIndex ? 1 : 0};
									transform: translateY({i === activePanelIndex ? '0' : '20px'});
								"
							>
								<button
									class="group relative px-8 py-3 overflow-hidden font-mono text-sm uppercase tracking-widest transition-all duration-300 hover:pl-12"
									style="
										border: 1px solid {panel.accentColor}80;
										color: {panel.accentColor};
									"
								>
									<span class="relative z-10">Jelajahi</span>
									<div
										class="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
										style="background: {panel.accentColor}20"
									></div>
									<svg
										class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>

					<!-- Progress Bar for Active Panel -->
					{#if i === activePanelIndex}
						<div class="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
							<div
								class="h-full transition-all duration-100"
								style="
									width: {(scrollProgress * 3 - i) * 100}%;
									background: {panel.accentColor};
								"
							></div>
						</div>
					{/if}
				</div>
			{/each}

			<!-- Navigation Dots -->
			<div class="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
				{#each panels as panel, i}
					<button
						class="group relative w-3 h-3 rounded-full transition-all duration-300"
						style="
							background: {i === activePanelIndex ? panel.accentColor : 'rgba(255,255,255,0.2)'};
							transform: scale({i === activePanelIndex ? 1.5 : 1});
						"
						aria-label="Go to {panel.title}"
					>
						{#if i === activePanelIndex}
							<span
								class="absolute inset-0 rounded-full animate-ping"
								style="background: {panel.accentColor}40"
							></span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Scroll Indicator -->
			<div
				class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
			>
				<p class="text-white/40 font-mono text-[10px] tracking-widest uppercase">Gulir ke Bawah</p>
				<div
					class="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
				>
					<div class="w-1 h-2 bg-white/60 rounded-full animate-bounce"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.panel {
		will-change: flex, transform, filter;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
