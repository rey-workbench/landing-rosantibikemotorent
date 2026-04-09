<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { getCachedImage, setCachedImage } from '$lib/stores/imageCache';
	import { LL } from '$i18n/i18n-svelte';

	let canvas = $state<HTMLCanvasElement>();
	let context: CanvasRenderingContext2D | null;
	let frameCount = 52;
	const images: HTMLImageElement[] = [];
	let imagesLoaded = $state(0);
	let scrollProgress = $state(0);
	let containerRef = $state<HTMLElement>();

	const features = $derived([
		{
			title: $LL.why_price_title(),
			description: $LL.why_price_desc(),
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12.586 2.586a2 2 0 0 0-2.828 0l-7.172 7.172a2 2 0 0 0 0 2.828l7.172 7.172a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828z"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`,
			progressTrigger: 0.1
		},
		{
			title: $LL.why_unit_title(),
			description: $LL.why_unit_desc(),
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
			progressTrigger: 0.4
		},
		{
			title: $LL.why_delivery_title(),
			description: $LL.why_delivery_desc(),
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M13 18H7V6a2 2 0 0 0-2-2H3"/><path d="M13 18h7a2 2 0 0 0 2-2V9l-3-3h-6Z"/><path d="M13 12h9"/></svg>`,
			progressTrigger: 0.7
		}
	]);

	let activeFeatureIndex = $state(-1);

	onMount(() => {
		if (canvas) context = canvas.getContext('2d');
		resize();

		const updateProgress = () => {
			imagesLoaded++;
			if (imagesLoaded === 1) render(0);
		};

		for (let i = 1; i <= frameCount; i++) {
			const frameIndex = i.toString().padStart(5, '0');
			const src = `/sequence/whychooseus/${frameIndex}.png`;

			const cached = getCachedImage(src);
			if (cached && cached.complete) {
				images.push(cached);
				updateProgress();
				continue;
			}

			const img = new Image();
			img.src = src;
			img.onload = () => {
				setCachedImage(src, img);
				updateProgress();
			};
			img.onerror = () => {
				console.warn(`Failed to load frame: ${frameIndex}`);
				updateProgress();
			};
			images.push(img);
		}

		const handleScroll = () => {
			if (!containerRef) return;
			const rect = containerRef.getBoundingClientRect();
			const startY = rect.top;
			const height = rect.height;
			const viewportHeight = window.innerHeight;

			const progressRaw = -startY / (height - viewportHeight);
			let progress = Math.max(0, Math.min(1, progressRaw));
			scrollProgress = progress;

			const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
			requestAnimationFrame(() => render(frameIndex));

			activeFeatureIndex = features.findIndex((_, i) => {
				const step = 1 / features.length;
				return progress >= i * step && progress < (i + 1) * step;
			});
			if (progress >= 0.95) activeFeatureIndex = features.length - 1;
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', resize);
		};
	});

	function render(index: number) {
		if (!context || !canvas || !images[index]) return;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		const dpr = window.devicePixelRatio || 1;
		if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			context.scale(dpr, dpr);
		}

		context.clearRect(0, 0, width, height);
		const img = images[index];
		const scale = Math.max(width / img.width, height / img.height);
		const x = width / 2 - (img.width / 2) * scale;
		const y = height / 2 - (img.height / 2) * scale;
		context.drawImage(img, x, y, img.width * scale, img.height * scale);
	}

	function resize() {
		if (images.length > 0) render(Math.floor(scrollProgress * frameCount) || 0);
	}
</script>

<div class="bg-brand-dark py-32" bind:this={containerRef}>
	<div class="h-[250vh] relative">
		<div class="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
			<div class="absolute inset-0 bg-brand-dark"></div>
			<div
				class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"
			></div>

			<div
				class="w-full max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
			>
				<div class="relative z-10 order-2 lg:order-1">
					<div class="mb-12">
						<h2
							class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center gap-2"
						>
							<span class="w-8 h-px bg-blue-500"></span>
							{$LL.why_title()}
							<span class="w-8 h-px bg-blue-500"></span>
						</h2>
						<h3
							class="text-4xl md:text-5xl lg:text-7xl font-black text-white mt-2 mb-6 leading-[0.9] uppercase tracking-tighter"
						>
							{$LL.why_heading()} <br />
							<span
								class="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-300 to-gray-600"
							>
								{$LL.why_heading_highlight()}
							</span>
						</h3>
						<p
							class="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed border-l-2 border-white/10 pl-6"
						>
							{$LL.why_desc()}
						</p>
					</div>

					<div class="space-y-3">
						{#each features as feature, i}
							<div
								class="p-5 rounded-2xl border transition-all duration-500 group cursor-pointer relative overflow-hidden"
								class:bg-white-5={i === activeFeatureIndex}
								class:border-white-10={i === activeFeatureIndex}
								class:bg-transparent={i !== activeFeatureIndex}
								class:border-transparent={i !== activeFeatureIndex}
							>
								{#if i === activeFeatureIndex}
									<div class="absolute inset-0 bg-white/[0.03] backdrop-blur-sm -z-10"></div>
								{/if}

								<div class="flex items-center gap-5">
									<div
										class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 {i ===
										activeFeatureIndex
											? 'text-blue-400 bg-blue-500/10'
											: 'text-gray-500 bg-white/5'}"
									>
										{@html feature.icon}
									</div>
									<div class="flex-1">
										<h3
											class="text-lg font-bold text-white transition-colors duration-300 {i ===
											activeFeatureIndex
												? 'text-blue-400'
												: 'text-gray-400'}"
										>
											{feature.title}
										</h3>
										<div
											class="grid transition-all duration-500 overflow-hidden"
											style="grid-template-rows: {i === activeFeatureIndex
												? '1fr'
												: '0fr'}; opacity: {i === activeFeatureIndex ? '1' : '0'}"
										>
											<p class="text-gray-500 text-sm mt-1 leading-relaxed min-h-0">
												{feature.description}
											</p>
										</div>
									</div>
								</div>

								<div
									class="absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-100 ease-linear"
									style="width: {i === activeFeatureIndex
										? Math.min(
												100,
												Math.max(
													0,
													((scrollProgress - i * (1 / features.length)) / (1 / features.length)) *
														100
												)
											)
										: 0}%"
								></div>
							</div>
						{/each}
					</div>
				</div>

				<div class="relative order-1 lg:order-2 flex justify-center lg:justify-end">
					<div
						class="relative w-full aspect-[4/3] max-w-lg rounded-2xl overflow-hidden border border-white/5 bg-gray-900 group"
					>
						<canvas
							bind:this={canvas}
							class="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
						></canvas>

						<div
							class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none"
						></div>
					</div>

					<div class="absolute -inset-10 -z-10 rounded-full opacity-0"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.bg-white-5 {
		background-color: rgba(255, 255, 255, 0.05);
	}
	.border-white-10 {
		border-color: rgba(255, 255, 255, 0.1);
	}
</style>
