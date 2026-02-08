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

			// Total scrollable distance is height - viewport
			const totalHeight = rect.height - viewportHeight;

			// Calculate progress
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

<div class="bg-brand-dark relative" bind:this={containerRef}>
	<!-- Height = 100vh * panels.length for 1:1 mapping + buffer -->
	<div class="relative" style="height: {panels.length * 100}vh">
		<!-- Invisible Snap Triggers -->
		<div class="absolute inset-0 flex flex-col pointer-events-none">
			{#each panels as _, i}
				<div class="h-screen w-full snap-start"></div>
			{/each}
		</div>

		<!-- Section Header (Sticky) -->

		<!-- Sticky Viewport -->
		<div
			class="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row bg-black"
			style="perspective: 1000px;"
		>
			<!-- Section Header (Overlay) -->
			<div
				class="absolute top-0 left-0 w-full z-20 pointer-events-none mix-blend-difference text-white"
			>
				<div class="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 text-center w-full px-4 pt-4">
					<h2
						class="text-[10px] md:text-sm font-bold text-blue-400 tracking-[0.2em] mb-2 md:mb-4 uppercase flex items-center justify-center gap-2"
					>
						<span class="w-4 md:w-8 h-[1px] bg-blue-400"></span>
						Pilih Petualanganmu
						<span class="w-4 md:w-8 h-[1px] bg-blue-400"></span>
					</h2>
					<h3
						class="text-2xl md:text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter"
					>
						Tiga Jalur, <br />
						<span
							class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500"
						>
							Satu Perjalanan.
						</span>
					</h3>
				</div>
			</div>
			{#each panels as panel, i}
				<div
					class="panel relative w-full md:w-auto md:h-full transition-all duration-700 md:duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden border-b border-white/10 md:border-b-0 md:border-r last:border-0"
					style="
						z-index: {i === activePanelIndex ? 10 : i};
						flex: {i === activePanelIndex ? '6' : '1'};
						filter: {i === activePanelIndex ? 'saturate(1.1) brightness(1)' : 'saturate(0) brightness(0.4)'};
					"
				>
					<!-- Video Layer with Zoom -->
					<div
						class="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-out"
						style="transform: scale({i === activePanelIndex ? 1.0 : 1.1})"
					>
						<video
							bind:this={videoRefs[i]}
							src={panel.video}
							class="w-full h-full object-cover"
							muted
							loop
							playsinline
						></video>
						<div class="absolute inset-0 bg-black/40 pointer-events-none"></div>
					</div>

					<!-- Color Overlay -->
					<div
						class="absolute inset-0 transition-opacity duration-700"
						style="
							background: linear-gradient(to top, {panel.accentColor}30, transparent 80%);
							opacity: {i === activePanelIndex ? 1 : 0};
						"
					></div>

					<!-- Gradient Overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-t {panel.gradientFrom} via-transparent to-black/40"
					></div>

					<!-- Panel Number -->
					<div
						class="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 transition-all duration-700 pointer-events-none"
						style="opacity: {i === activePanelIndex ? 0.8 : 0.3}; transform: scale({i ===
						activePanelIndex
							? 1
							: 0.8})"
					>
						<span
							class="hidden md:block font-mono text-[80px] md:text-[120px] lg:text-[180px] font-black leading-none"
							style="
								color: transparent;
								-webkit-text-stroke: 1px {panel.accentColor}60;
							"
						>
							0{i + 1}
						</span>
						<!-- Mobile Number -->
						<span
							class="block md:hidden font-mono text-[60px] font-black leading-none absolute -left-2 top-1/2 -translate-y-1/2 opacity-20"
						>
							0{i + 1}
						</span>
					</div>

					<!-- Content Overlay -->
					<div class="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-end">
						<div
							class="transition-all duration-700 ease-out"
							style="
								transform: translateY({i === activePanelIndex ? '0' : '20px'});
								opacity: {i === activePanelIndex ? 1 : 0};
							"
						>
							<!-- Subtitle -->
							<div
								class="flex items-center gap-3 mb-1 md:mb-3 {i !== activePanelIndex
									? 'hidden'
									: 'flex'}"
							>
								<div
									class="h-px w-4 md:w-8 transition-all duration-500"
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
								class="text-white text-2xl md:text-4xl lg:text-7xl font-black uppercase leading-none tracking-tight mb-2 md:mb-4 whitespace-nowrap md:whitespace-normal"
							>
								{panel.title}
							</h3>

							<!-- Description -->
							<div
								class="overflow-hidden transition-all duration-700 delay-100 {i !== activePanelIndex
									? 'hidden'
									: 'block'}"
								style="max-height: {i === activePanelIndex ? '200px' : '0'}"
							>
								<p
									class="text-white/80 text-xs md:text-lg max-w-md leading-relaxed font-light line-clamp-3 md:line-clamp-none"
								>
									{panel.description}
								</p>
							</div>
						</div>
					</div>

					<!-- Mobile Active Indicator Bar -->
					{#if i === activePanelIndex}
						<div class="absolute bottom-0 left-0 h-1 bg-white/20 w-full md:hidden">
							<div
								class="h-full transition-all duration-100"
								style="
									width: {((scrollProgress * panels.length) % 1) * 100}%;
									background: {panel.accentColor};
								"
							></div>
						</div>
					{/if}
				</div>
			{/each}

			<!-- Navigation Dots -->
			<div
				class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 md:gap-4 z-20"
			>
				{#each panels as panel, i}
					<button
						class="group relative w-1.5 h-1.5 md:w-3 md:h-3 rounded-full transition-all duration-300"
						style="
							background: {i === activePanelIndex ? panel.accentColor : 'rgba(255,255,255,0.2)'};
							transform: scale({i === activePanelIndex ? 1.5 : 1});
						"
						aria-label="Go to {panel.title}"
						on:click={() => {
							// Scroll to the specific section
							if (containerRef) {
								const sectionHeight = window.innerHeight;
								const targetY = containerRef.offsetTop + i * sectionHeight;
								window.scrollTo({ top: targetY, behavior: 'smooth' });
							}
						}}
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
		</div>
	</div>
</div>

<style>
	.panel {
		will-change: flex, transform, filter;
	}
</style>
