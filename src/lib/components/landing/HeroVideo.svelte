<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoaded } from '$lib/stores/loading';
	import TextOverlay from './HeroOverlay.svelte';

	let scrollProgress = $state(0);

	onMount(() => {
		// Since it's a video, we can consider it "loaded" once the component or window is ready
		// or when the video can play through.
		setTimeout(() => isLoaded.set(true), 1000);

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const viewportHeight = window.innerHeight;
			const sectionHeight = viewportHeight * 5;
			const overlapAdjust = viewportHeight * 1;
			const effectiveScrollRange = sectionHeight - overlapAdjust;

			let progress = scrollTop / (effectiveScrollRange - viewportHeight);
			if (progress < 0) progress = 0;
			if (progress > 1) progress = 1;

			scrollProgress = progress;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div class="bg-brand-dark">
	<div class="h-[500vh] relative">
		<div class="sticky top-0 h-screen w-full overflow-hidden">
			<!-- Video Background -->
			<video
				autoplay
				muted
				loop
				playsinline
				class="absolute inset-0 w-full h-full object-cover"
				poster="/video/hero.png"
			>
				<source src="/video/hero.mp4" type="video/mp4" />
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

			<!-- Text Overlay -->
			<TextOverlay {scrollProgress} />
		</div>
	</div>
</div>
