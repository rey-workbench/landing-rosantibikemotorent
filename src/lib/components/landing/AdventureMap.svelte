<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { getCachedImage, setCachedImage } from '$lib/stores/imageCache';

	let scrollProgress = 0;
	let containerRef: HTMLElement;
	let hasStartedLoading = false;

	// Configuration per source
	const sources = {
		hero: {
			path: '/sequence/hero',
			count: 153,
			images: [] as HTMLImageElement[],
			getFileName: (i: number) => `ezgif-frame-${i.toString().padStart(3, '0')}.png`
		},
		whychooseus: {
			path: '/sequence/whychooseus',
			count: 52,
			images: [] as HTMLImageElement[],
			getFileName: (i: number) => `${i.toString().padStart(5, '0')}.png`
		}
	};

	const panels = [
		{
			id: 'nature',
			title: 'Wild Nature',
			subtitle: 'Escape the Ordinary',
			description:
				'Ride through lush forests and breathtaking mountain trails. Feel the wind, embrace the wild.',
			source: 'hero',
			frameStart: 0,
			frameEnd: 75,
			accentColor: '#4ade80',
			gradientFrom: 'from-emerald-900/90',
			clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'
		},
		{
			id: 'city',
			title: 'Urban Pulse',
			subtitle: 'City Lights & Nights',
			description:
				'Navigate the vibrant streets and discover hidden gems in every corner of the city.',
			source: 'whychooseus',
			frameStart: 0,
			frameEnd: 51,
			accentColor: '#60a5fa',
			gradientFrom: 'from-blue-900/90',
			clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)'
		},
		{
			id: 'coast',
			title: 'Coastal Vibes',
			subtitle: 'Sun, Sand, & Ride',
			description: 'Chase the horizon along stunning coastlines. Where the road meets the sea.',
			source: 'hero',
			frameStart: 76,
			frameEnd: 152,
			accentColor: '#fb923c',
			gradientFrom: 'from-orange-900/90',
			clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
		}
	];

	// Canvas refs
	let canvasRefs: HTMLCanvasElement[] = [];

	// Lazy load images using shared cache
	const preloadImages = () => {
		if (hasStartedLoading) return;
		hasStartedLoading = true;

		(Object.keys(sources) as Array<keyof typeof sources>).forEach((key) => {
			const config = sources[key];
			for (let i = 1; i <= config.count; i++) {
				const src = `${config.path}/${config.getFileName(i)}`;

				// Check cache first - reuse from HeroSequence/WhyChooseUs
				const cached = getCachedImage(src);
				if (cached && cached.complete) {
					config.images.push(cached);
					continue;
				}

				// Load new image and cache it
				const img = new Image();
				img.src = src;
				img.onload = () => {
					setCachedImage(src, img);
				};
				config.images.push(img);
			}
		});
		// Trigger initial render
		setTimeout(() => {
			panels.forEach((_, idx) => renderPanel(idx, 0));
		}, 100);
	};

	const renderPanel = (panelIndex: number, progress: number) => {
		const canvas = canvasRefs[panelIndex];
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const panel = panels[panelIndex];
		const sourceConfig = sources[panel.source as keyof typeof sources];

		// Sequential Logic
		const segmentSize = 1 / 3;
		const start = panelIndex * segmentSize;

		let localProgress = (progress - start) / segmentSize;
		localProgress = Math.max(0, Math.min(1, localProgress));

		const totalPanelFrames = panel.frameEnd - panel.frameStart;
		const localFrameIndex = Math.floor(localProgress * totalPanelFrames);

		const targetFrameIndex = Math.min(
			panel.frameEnd,
			Math.max(panel.frameStart, panel.frameStart + localFrameIndex)
		);

		const img = sourceConfig.images[targetFrameIndex];

		if (img && img.complete) {
			const w = canvas.width;
			const h = canvas.height;
			const imgRatio = img.width / img.height;
			const canvasRatio = w / h;

			let drawW, drawH, x, y;
			if (imgRatio > canvasRatio) {
				drawH = h;
				drawW = img.width * (h / img.height);
				x = (w - drawW) / 2;
				y = 0;
			} else {
				drawW = w;
				drawH = img.height * (w / img.width);
				x = 0;
				y = (h - drawH) / 2;
			}

			ctx.clearRect(0, 0, w, h);
			ctx.drawImage(img, x, y, drawW, drawH);
		}
	};

	// Helper to determine active state for UI
	$: activePanelIndex = Math.min(2, Math.floor(scrollProgress * 3));

	onMount(() => {
		// Lazy loading: only start loading when section is near viewport
		const lazyObserver = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					preloadImages();
					lazyObserver.disconnect();
				}
			},
			{ rootMargin: '500px' } // Start loading 500px before section is visible
		);

		if (containerRef) {
			lazyObserver.observe(containerRef);
		}

		const resize = () => {
			canvasRefs.forEach((c) => {
				if (c) {
					c.width = c.parentElement?.clientWidth || window.innerWidth / 3;
					c.height = window.innerHeight;
				}
			});
			panels.forEach((_, i) => renderPanel(i, scrollProgress));
		};
		window.addEventListener('resize', resize);
		setTimeout(resize, 100);

		const handleScroll = () => {
			if (!containerRef) return;
			const rect = containerRef.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const totalHeight = rect.height - viewportHeight;

			const raw = -rect.top / totalHeight;
			scrollProgress = Math.max(0, Math.min(0.999, raw));

			requestAnimationFrame(() => {
				panels.forEach((_, i) => renderPanel(i, scrollProgress));
			});
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', resize);
			lazyObserver.disconnect();
		};
	});
</script>

<div class="bg-black relative" bind:this={containerRef}>
	<!-- Extended Height for Sequential Scroll -->
	<div class="h-[500vh] relative">
		<!-- Section Header -->
		<div class="sticky top-0 z-10 pointer-events-none">
			<div class="absolute top-8 left-1/2 -translate-x-1/2 text-center">
				<p class="text-white/40 font-mono text-xs tracking-[0.5em] uppercase mb-2">
					Choose Your Adventure
				</p>
				<h2 class="text-white text-2xl md:text-4xl font-bold">Three Paths, One Journey</h2>
			</div>
		</div>

		<!-- Sticky Viewport -->
		<div
			class="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row bg-black"
			style="perspective: 1000px;"
		>
			{#each panels as panel, i}
				<div
					class="panel relative w-full md:w-auto md:h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
					style="
						clip-path: {typeof window !== 'undefined' && window.innerWidth >= 768 ? panel.clipPath : 'none'};
						margin-left: {typeof window !== 'undefined' && window.innerWidth >= 768 && i > 0 ? '-10%' : '0'};
						margin-top: {typeof window !== 'undefined' && window.innerWidth < 768 && i > 0 ? '-20px' : '0'};
						z-index: {i === activePanelIndex ? 10 : i};
						flex: {i === activePanelIndex ? '2.5' : '0.8'};
						filter: {typeof window !== 'undefined' && window.innerWidth >= 768
						? i === activePanelIndex
							? 'saturate(1.2) contrast(1.05)'
							: 'saturate(0.3) brightness(0.6)'
						: 'none'};
						box-shadow: {typeof window !== 'undefined' && window.innerWidth >= 768 && i === activePanelIndex
						? '0 0 100px rgba(0,0,0,0.5)'
						: 'none'};
					"
				>
					<!-- Dynamic Edge Separators -->
					{#if typeof window !== 'undefined'}
						<svg
							class="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<defs>
								<filter id="glow-line-{i}" x="-50%" y="-50%" width="200%" height="200%">
									<feGaussianBlur stdDeviation="1" result="blur" />
									<feComposite in="SourceGraphic" in2="blur" operator="over" />
								</filter>
							</defs>

							{#if window.innerWidth >= 768}
								<!-- DESKTOP SLANTED DIVIDERS -->
								{#if i < 2}
									<line
										x1="100"
										y1="0"
										x2="85"
										y2="100"
										stroke={panel.accentColor}
										stroke-width="3"
										stroke-opacity="0.3"
										filter="url(#glow-line-{i})"
										vector-effect="non-scaling-stroke"
									/>
									<line
										x1="100"
										y1="0"
										x2="85"
										y2="100"
										stroke="white"
										stroke-width="1"
										stroke-opacity="0.8"
										vector-effect="non-scaling-stroke"
									/>
								{/if}

								{#if i > 0}
									<line
										x1="15"
										y1="0"
										x2="0"
										y2="100"
										stroke={panel.accentColor}
										stroke-width="3"
										stroke-opacity="0.3"
										filter="url(#glow-line-{i})"
										vector-effect="non-scaling-stroke"
									/>
									<line
										x1="15"
										y1="0"
										x2="0"
										y2="100"
										stroke="white"
										stroke-width="1"
										stroke-opacity="0.8"
										vector-effect="non-scaling-stroke"
									/>
								{/if}
							{:else}
								<!-- MOBILE HORIZONTAL DIVIDERS -->
								{#if i > 0}
									<!-- Top Edge Divider for current panel -->
									<line
										x1="0"
										y1="0"
										x2="100"
										y2="0"
										stroke={panel.accentColor}
										stroke-width="2"
										stroke-opacity="0.5"
										filter="url(#glow-line-{i})"
										vector-effect="non-scaling-stroke"
									/>
									<line
										x1="0"
										y1="0"
										x2="100"
										y2="0"
										stroke="white"
										stroke-width="1"
										vector-effect="non-scaling-stroke"
									/>
								{/if}
							{/if}
						</svg>
					{/if}

					<!-- Canvas Layer with Zoom -->
					<div
						class="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-out"
						style="transform: scale({i === activePanelIndex ? 1.0 : 1.2})"
					>
						<canvas bind:this={canvasRefs[i]} class="w-full h-full object-cover"></canvas>
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
						class="absolute inset-0 bg-gradient-to-t {panel.gradientFrom} via-black/20 to-black/60"
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
									<span class="relative z-10">Explore</span>
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
				<p class="text-white/40 font-mono text-[10px] tracking-widest uppercase">
					Scroll to Explore
				</p>
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
