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
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#525257] mb-3">
				{$LL.why_title()}
			</p>
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-6 font-display"
			>
				{$LL.why_heading()} <br />
				<span class="text-[#525257]">
					{$LL.why_heading_highlight()}
				</span>
			</h2>
			<p class="text-[#525257] text-xl md:text-2xl font-normal leading-relaxed max-w-lg mb-8">
				{$LL.why_desc()}
			</p>

			<div class="flex flex-col mt-12 w-full max-w-lg">
				<div class="flex gap-5 sm:gap-6 border-t border-black/10 py-6 items-start">
					<span class="shrink-0 text-xs font-bold tracking-widest text-apple-blue mt-1">01</span>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2 font-display">
							{$LL.why_unit_title()}
						</h3>
						<p class="text-base text-[#525257] leading-relaxed">{$LL.why_unit_desc()}</p>
					</div>
				</div>

				<div class="flex gap-5 sm:gap-6 border-t border-black/10 py-6 items-start">
					<span class="shrink-0 text-xs font-bold tracking-widest text-apple-blue mt-1">02</span>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2 font-display">
							{$LL.why_delivery_title()}
						</h3>
						<p class="text-base text-[#525257] leading-relaxed">{$LL.why_delivery_desc()}</p>
					</div>
				</div>

				<div class="flex gap-5 sm:gap-6 border-t border-b border-black/10 py-6 items-start">
					<span class="shrink-0 text-xs font-bold tracking-widest text-apple-blue mt-1">03</span>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-2 font-display">
							{$LL.why_price_title()}
						</h3>
						<p class="text-base text-[#525257] leading-relaxed">{$LL.why_price_desc()}</p>
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
