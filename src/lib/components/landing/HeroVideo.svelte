<script lang="ts">
	import { onMount } from 'svelte';
	import { loadingState } from '$lib/stores/loading.svelte';
	import TextOverlay from './HeroOverlay.svelte';

	let videoRef = $state<HTMLVideoElement>();
	let isDesktop = $state(true); // Default true for SSR, we will refine onMount

	onMount(() => {
		setTimeout(() => (loadingState.isLoaded = true), 1000);

		// Only load video on tablet/desktop viewports
		isDesktop = window.matchMedia('(min-width: 768px)').matches;

		const start = () => {
			if (videoRef && isDesktop) {
				if (!videoRef.src) {
					videoRef.src = '/video/hero.mp4'; // Replace with hero-compressed.webm when available
				}
				if (videoRef.paused) {
					videoRef.play().catch(() => {
						/* autoplay blocked — poster stays visible */
					});
				}
			}
		};

		// Never let the (large) hero video compete with initial page load:
		// start it only after the page has loaded, and only while it is visible.
		if (document.readyState === 'complete') {
			start();
		} else {
			window.addEventListener('load', start, { once: true });
		}

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						start();
					} else if (videoRef && !videoRef.paused) {
						videoRef.pause();
					}
				}
			},
			{ threshold: 0.05 }
		);
		if (videoRef) io.observe(videoRef);

		return () => io.disconnect();
	});
</script>

<div class="relative h-svh w-full overflow-hidden bg-black">
	{#if !isDesktop}
		<picture>
			<source srcset="/video/posters/hero.avif" type="image/avif" />
			<source srcset="/video/posters/hero.webp" type="image/webp" />
			<img src="/video/posters/hero.webp" alt="Motor Rent Hero" fetchpriority="high" class="absolute inset-0 w-full h-full object-cover" />
		</picture>
	{:else}
		<video
			bind:this={videoRef}
			muted
			loop
			playsinline
			preload="none"
			poster="/video/posters/hero.webp"
			class="absolute inset-0 w-full h-full object-cover"
		>
			<track kind="captions" srclang="id" label="Bahasa Indonesia" default />
		</video>
	{/if}

	<!-- Cinematic Overlays -->
	<div class="absolute inset-0 pointer-events-none">
		<!-- Grain/Noise Effect -->
		<div
			class="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.svg')]"
		></div>

		<!-- Radial Vignette -->
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"
		></div>

		<!-- Darken wash -->
		<div class="absolute inset-0 bg-black/60"></div>
	</div>

	<!-- Text Overlay -->
	<TextOverlay />
</div>
