<script lang="ts">
	import { onMount } from 'svelte';
	import { LL } from '$i18n/i18n-svelte';
	import { lazyVideo } from '$lib/actions/lazyVideo';

	let videoRef = $state<HTMLVideoElement>();
	let scrollProgress = $state(0);
	let containerRef = $state<HTMLElement>();

	const features = $derived([
		{
			title: $LL.why_price_title(),
			description: $LL.why_price_desc(),
			icon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12.586 2.586a2 2 0 0 0-2.828 0l-7.172 7.172a2 2 0 0 0 0 2.828l7.172 7.172a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828z"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`,
			progressTrigger: 0.1
		},
		{
			title: $LL.why_unit_title(),
			description: $LL.why_unit_desc(),
			icon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
			progressTrigger: 0.4
		},
		{
			title: $LL.why_delivery_title(),
			description: $LL.why_delivery_desc(),
			icon: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M13 18H7V6a2 2 0 0 0-2-2H3"/><path d="M13 18h7a2 2 0 0 0 2-2V9l-3-3h-6Z"/><path d="M13 12h9"/></svg>`,
			progressTrigger: 0.7
		}
	]);

	let activeFeatureIndex = $state(-1);
	let isMobile = $state(false);



	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 1024;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);

		const handleScroll = () => {
			if (!containerRef) return;
			const rect = containerRef.getBoundingClientRect();
			const startY = rect.top;
			const height = rect.height;
			const viewportHeight = window.innerHeight;

			const progressRaw = -startY / (height - viewportHeight);
			let progress = Math.max(0, Math.min(1, progressRaw));
			scrollProgress = progress;

			activeFeatureIndex = features.findIndex((_, i) => {
				const step = 1 / features.length;
				return progress >= i * step && progress < (i + 1) * step;
			});
			if (progress >= 0.95) activeFeatureIndex = features.length - 1;
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<div class="bg-brand-background py-12 lg:py-32" bind:this={containerRef}>
	<div class={isMobile ? 'relative' : 'h-[250vh] relative'}>
		<div
			class={isMobile
				? 'relative w-full flex flex-col justify-center overflow-hidden py-8'
				: 'sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden'}
		>
			<div class="absolute inset-0 bg-brand-background"></div>
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
							class="text-4xl md:text-5xl lg:text-7xl font-black text-brand-fg mt-2 mb-6 leading-[0.9] uppercase tracking-tighter"
						>
							{$LL.why_heading()} <br />
							<span
								class="text-transparent bg-clip-text bg-linear-to-r from-brand-fg via-brand-fg/80 to-brand-fg/40"
							>
								{$LL.why_heading_highlight()}
							</span>
						</h3>
						<p
							class="text-brand-muted text-base md:text-lg max-w-lg leading-relaxed border-l-2 border-brand-border pl-6"
						>
							{$LL.why_desc()}
						</p>
					</div>

					<div class="space-y-3">
						{#each features as feature, i}
							<div
								class="p-5 rounded-2xl border transition-all duration-500 group cursor-pointer relative overflow-hidden"
								class:bg-brand-surface={isMobile || i === activeFeatureIndex}
								class:border-brand-border={isMobile || i === activeFeatureIndex}
								class:bg-transparent={!isMobile && i !== activeFeatureIndex}
								class:border-transparent={!isMobile && i !== activeFeatureIndex}
							>
								{#if isMobile || i === activeFeatureIndex}
									<div class="absolute inset-0 bg-brand-surface/40 backdrop-blur-sm -z-10"></div>
								{/if}

								<div class="flex items-center gap-5">
									<div
										class="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 {i ===
										activeFeatureIndex
											? 'text-brand-highlight bg-brand-highlight/10'
											: 'text-brand-muted bg-brand-surface-soft'}"
									>
										{@html feature.icon}
									</div>
									<div class="flex-1">
										<h3
											class="text-lg font-bold text-brand-fg transition-colors duration-300 {i ===
											activeFeatureIndex
												? 'text-brand-highlight'
												: 'text-brand-fg'}"
										>
											{feature.title}
										</h3>
										<div
											class="grid transition-all duration-500 overflow-hidden"
											style="grid-template-rows: {isMobile || i === activeFeatureIndex
												? '1fr'
												: '0fr'}; opacity: {isMobile || i === activeFeatureIndex ? '1' : '0'}"
										>
											<p class="text-brand-muted text-sm mt-1 leading-relaxed min-h-0">
												{feature.description}
											</p>
										</div>
									</div>
								</div>

								<div
									class="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-100 ease-linear"
									style="width: {!isMobile && i === activeFeatureIndex
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
						class="relative w-full aspect-4/3 max-w-lg rounded-2xl overflow-hidden border border-brand-border bg-brand-surface-soft group"
					>
						<video
							preload="metadata" src="/video/whychooseus.mp4" use:lazyVideo
							poster="/video/posters/whychooseus.jpg"
							class="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
							bind:this={videoRef}
							muted
							loop
							playsinline
						></video>

						<div
							class="absolute inset-0 bg-linear-to-t from-brand-background/60 to-transparent pointer-events-none"
						></div>
					</div>

					<div class="absolute -inset-10 -z-10 rounded-full opacity-0"></div>
				</div>
			</div>
		</div>
	</div>
</div>

