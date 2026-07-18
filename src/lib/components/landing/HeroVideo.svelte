<script lang="ts">
	import { onMount } from 'svelte';
	import { loadingState } from '$lib/stores/loading.svelte';
	import { lazyVideo } from '$lib/actions/lazyVideo';
	import TextOverlay from './HeroOverlay.svelte';

	let containerRef: HTMLElement;
	let scrollTop = $state(0);
	let scrollProgress = $state(0);
	let isMobile = $state(false);

	onMount(() => {
		setTimeout(() => (loadingState.isLoaded = true), 1000);

		const handleScroll = () => {
			if (!containerRef) return;
			scrollTop = window.scrollY;
			const vh = window.innerHeight;
			// Container: 500vh sticky. Effective scroll range: 500vh - 100vh(overlap) - 1vh = ~3vh
			const effectiveRange = vh * 3;
			scrollProgress = Math.max(0, Math.min(1, scrollTop / effectiveRange));
		};

		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		isMobile = window.innerWidth < 768;
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', checkMobile);
		handleScroll(); // run immediately

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<div class="bg-brand-dark" bind:this={containerRef}>
	<div class="h-[500vh] relative">
		<div class="sticky top-0 h-screen w-full overflow-hidden">
			<video muted loop playsinline preload="metadata" src="/video/hero.mp4" use:lazyVideo poster="/video/posters/hero.jpg" class="absolute inset-0 w-full h-full object-cover">
			</video>

			<!-- Cinematic Overlays -->
			<div class="absolute inset-0 pointer-events-none">
				<!-- Grain/Noise Effect -->
				<div
					class="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
				></div>

				<!-- Radial Vignette -->
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"
				></div>

				<!-- Darken wash -->
				<div class="absolute inset-0 bg-black/30"></div>
			</div>

			{#if scrollProgress < 0.95}
				<!-- Text Overlay -->
				<TextOverlay {scrollProgress} {isMobile} />
			{/if}
		</div>
	</div>
</div>
