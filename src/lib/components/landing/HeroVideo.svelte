<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoaded } from '$lib/stores/loading';
	import TextOverlay from './HeroOverlay.svelte';

	let scrollProgress = $state(0);
	let isMobile = $state(false);

	onMount(() => {
		setTimeout(() => isLoaded.set(true), 1000);

		let interval: ReturnType<typeof setInterval> | undefined;

		const startMobileSlides = () => {
			if (interval) return;
			let currentSlide = 0;
			const slides = [0.07, 0.27, 0.47, 0.67];
			scrollProgress = slides[0];
			interval = setInterval(() => {
				currentSlide = (currentSlide + 1) % slides.length;
				scrollProgress = slides[currentSlide];
			}, 4000);
		};

		const stopMobileSlides = () => {
			if (interval) {
				clearInterval(interval);
				interval = undefined;
			}
		};

		const handleScroll = () => {
			if (isMobile) return;
			const scrollTop = window.scrollY;
			const vh = window.innerHeight;
			// Container: 500vh sticky. Effective scroll range: 500vh - 100vh(overlap) - 1vh = ~3vh
			const effectiveRange = vh * 3;
			scrollProgress = Math.max(0, Math.min(1, scrollTop / effectiveRange));
		};

		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			if (mobile !== isMobile) {
				isMobile = mobile;
				if (mobile) {
					stopMobileSlides();
					window.removeEventListener('scroll', handleScroll);
					startMobileSlides();
				} else {
					stopMobileSlides();
					window.addEventListener('scroll', handleScroll);
				}
			}
		};

		isMobile = window.innerWidth < 768;
		if (isMobile) {
			startMobileSlides();
		} else {
			window.addEventListener('scroll', handleScroll);
			handleScroll(); // run immediately to set correct scrollProgress based on initial scroll position
		}
		window.addEventListener('resize', checkMobile);

		return () => {
			stopMobileSlides();
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<div class="bg-brand-dark">
	<div class={isMobile ? 'h-screen relative' : 'h-[500vh] relative'}>
		<div
			class={isMobile
				? 'h-full w-full overflow-hidden relative'
				: 'sticky top-0 h-screen w-full overflow-hidden'}
		>
			<!-- Video Background -->
			<video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover">
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

			{#if isMobile || scrollProgress < 0.95}
				<!-- Text Overlay -->
				<TextOverlay {scrollProgress} {isMobile} />
			{/if}
		</div>
	</div>
</div>
