<script lang="ts">
	import { LL } from '$i18n/i18n-svelte';
	import { lazyVideo } from '$lib/actions/lazyVideo';

	let videoRef = $state<HTMLVideoElement>();
	let isPlaying = $state(false);

	function togglePlay() {
		if (!videoRef) return;
		if (isPlaying) {
			videoRef.pause();
			isPlaying = false;
		} else {
			videoRef.play();
			isPlaying = true;
		}
	}
</script>

<div class="bg-white py-24 md:py-36" id="promotional-video">
	<div
		class="w-full max-w-345 mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
	>
		<!-- Left: Text -->
		<div class="text-left order-2 lg:order-1">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#86868b] mb-3">
				Experience The Ride
			</p>
			<h2
				class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-6"
			>
				{$LL.why_heading()} <br />
				<span class="text-[#86868b]">
					{$LL.why_heading_highlight()}
				</span>
			</h2>
			<p class="text-[#86868b] text-xl md:text-2xl font-normal leading-relaxed max-w-lg mb-8">
				{$LL.why_desc()}
			</p>

			<div class="space-y-8 max-w-lg mt-12">
				<div class="flex items-start gap-5">
					<div class="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-center shrink-0">
						<svg class="w-6 h-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-1">{$LL.why_unit_title()}</h3>
						<p class="text-base text-[#86868b] leading-relaxed">{$LL.why_unit_desc()}</p>
					</div>
				</div>

				<div class="flex items-start gap-5">
					<div class="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-center shrink-0">
						<svg class="w-6 h-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-1">{$LL.why_delivery_title()}</h3>
						<p class="text-base text-[#86868b] leading-relaxed">{$LL.why_delivery_desc()}</p>
					</div>
				</div>

				<div class="flex items-start gap-5">
					<div class="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-center shrink-0">
						<svg class="w-6 h-6 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-xl font-bold text-[#1d1d1f] tracking-tight mb-1">{$LL.why_price_title()}</h3>
						<p class="text-base text-[#86868b] leading-relaxed">{$LL.why_price_desc()}</p>
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
			<video
				preload="metadata"
				src="/video/whychooseus.mp4"
				use:lazyVideo
				poster="/video/posters/whychooseus.jpg"
				class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
				bind:this={videoRef}
				playsinline
				onplay={() => (isPlaying = true)}
				onpause={() => (isPlaying = false)}
				onended={() => (isPlaying = false)}
			></video>

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
