<script lang="ts">
	import { onMount } from 'svelte';
	import { loadingState } from '$lib/stores/loading.svelte';
	import { lazyVideo } from '$lib/actions/lazyVideo';
	import TextOverlay from './HeroOverlay.svelte';

	onMount(() => {
		setTimeout(() => (loadingState.isLoaded = true), 1000);
	});
</script>

<div class="relative h-svh w-full overflow-hidden bg-black">
	<video
		muted
		loop
		playsinline
		preload="metadata"
		src="/video/hero.mp4"
		use:lazyVideo
		poster="/video/posters/hero.jpg"
		class="absolute inset-0 w-full h-full object-cover"
	></video>

	<!-- Cinematic Overlays -->
	<div class="absolute inset-0 pointer-events-none">
		<!-- Grain/Noise Effect -->
		<div
			class="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
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
