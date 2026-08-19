<script lang="ts">
	import { onMount } from 'svelte';
	import { LL } from '$i18n/i18n-svelte';

	let videoRef = $state<HTMLVideoElement>();
	let containerRef = $state<HTMLElement>();
	let isPlaying = $state(false);
	let isVisible = $state(false);

	onMount(() => {
		if (containerRef) {
			const io = new IntersectionObserver(
				(entries) => {
					if (entries[0]?.isIntersecting) {
						isVisible = true;
						io.disconnect();
					}
				},
				{ rootMargin: '300px' }
			);
			io.observe(containerRef);
			return () => io.disconnect();
		}
	});

	function togglePlay() {
		if (!videoRef) return;
		if (isPlaying) {
			videoRef.pause();
			isPlaying = false;
		} else {
			if (!videoRef.src) {
				videoRef.src = '/video/whychooseus.mp4';
			}
			videoRef.play();
			isPlaying = true;
		}
	}
</script>

<div class="bg-white py-24 md:py-36" id="promotional-video" bind:this={containerRef}>
	<div
		class="w-full max-w-345 mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
	>
		<!-- Left: Text -->
		<div class="text-left order-2 lg:order-1">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b6b70] mb-3">
				{$LL.why_title()}
			</p>
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-6"
			>
				{$LL.why_heading()} <br />
				<span class="text-[#6b6b70]">
					{$LL.why_heading_highlight()}
				</span>
			</h2>
			<p class="text-[#6b6b70] text-xl md:text-2xl font-normal leading-relaxed max-w-lg mb-8">
				{$LL.why_desc()}
			</p>

			<div class="flex flex-col mt-12 w-full max-w-lg">
				<!-- Item 1: Apple Blue -->
				<div class="flex gap-5 sm:gap-6 border-t border-black/10 py-6 items-start">
					<div class="shrink-0 w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#0071e3] flex items-center justify-center font-bold text-sm shadow-xs">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2">
							{$LL.why_unit_title()}
						</h3>
						<p class="text-base text-[#6b6b70] leading-relaxed">{$LL.why_unit_desc()}</p>
					</div>
				</div>

				<!-- Item 2: Apple Mint / Emerald -->
				<div class="flex gap-5 sm:gap-6 border-t border-black/10 py-6 items-start">
					<div class="shrink-0 w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#059669] flex items-center justify-center font-bold text-sm shadow-xs">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2">
							{$LL.why_delivery_title()}
						</h3>
						<p class="text-base text-[#6b6b70] leading-relaxed">{$LL.why_delivery_desc()}</p>
					</div>
				</div>

				<!-- Item 3: Apple Sunset Orange -->
				<div class="flex gap-5 sm:gap-6 border-t border-b border-black/10 py-6 items-start">
					<div class="shrink-0 w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 text-[#d97706] flex items-center justify-center font-bold text-sm shadow-xs">
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2">
							{$LL.why_price_title()}
						</h3>
						<p class="text-base text-[#6b6b70] leading-relaxed">{$LL.why_price_desc()}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Video -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="relative w-full aspect-video rounded-3xl overflow-hidden border border-black/5 bg-black shadow-2xl group cursor-pointer order-1 lg:order-2"
			onclick={togglePlay}
		>
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				preload="none"
				poster={isVisible ? '/video/posters/whychooseus.webp' : undefined}
				class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
				bind:this={videoRef}
				playsinline
				onplay={() => (isPlaying = true)}
				onpause={() => (isPlaying = false)}
				onended={() => (isPlaying = false)}
			>
				<track kind="captions" srclang="id" label="Bahasa Indonesia" default />
			</video>

			{#if !isPlaying}
				<div
					class="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300"
				>
					<div
						class="w-20 h-20 bg-white/90 backdrop-blur-md text-black rounded-full flex items-center justify-center shadow-xl transform transition-transform duration-300 group-hover:scale-110"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="none"
							class="ml-1"
						>
							<polygon points="5 3 19 12 5 21 5 3"></polygon>
						</svg>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
