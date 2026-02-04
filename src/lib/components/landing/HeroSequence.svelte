<script lang="ts">
	import { onMount } from 'svelte';
	import { loadingProgress, isLoaded } from '$lib/stores/loading';
	import { getCachedImage, setCachedImage } from '$lib/stores/imageCache';
	import TextOverlay from './HeroOverlay.svelte';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let frameCount = 153;
	const images: HTMLImageElement[] = [];
	let imagesLoaded = 0;
	let scrollProgress = 0;
	const path = '/sequence/hero/';

	onMount(() => {
		// Safe context access
		if (canvas) context = canvas.getContext('2d');

		resize();

		// Preload images with caching
		const updateProgress = () => {
			imagesLoaded++;
			loadingProgress.set((imagesLoaded / frameCount) * 100);

			if (imagesLoaded === frameCount) {
				setTimeout(() => isLoaded.set(true), 500);
			}

			if (imagesLoaded === 1) {
				render(0);
			}
		};

		for (let i = 1; i <= frameCount; i++) {
			const frameIndex = i.toString().padStart(3, '0');
			const src = `${path}ezgif-frame-${frameIndex}.png`;

			// Check cache first
			const cached = getCachedImage(src);
			if (cached && cached.complete) {
				images.push(cached);
				updateProgress();
				continue;
			}

			// Load new image and cache it
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
			const scrollTop = window.scrollY; // Use window.scrollY for reliability
			const viewportHeight = window.innerHeight;

			// Define the scroll range specifically for this 500vh section
			// The content overlap happens effectively at the end of this range
			// We treat the "interactive" scroll range as 0 to 400vh (approximating cover point)
			const sectionHeight = viewportHeight * 5; // 500vh
			const overlapAdjust = viewportHeight * 1; // 100vh overlap
			const effectiveScrollRange = sectionHeight - overlapAdjust; // 400vh

			// Text Progress: 0 to 1 over 400vh
			let progress = scrollTop / (effectiveScrollRange - viewportHeight);
			if (progress < 0) progress = 0;
			if (progress > 1) progress = 1;

			scrollProgress = progress;

			// Frame scrubbing: Map frames to fill the available space nicely
			// We want the last frame to hit around the time screen is covered
			const scrubProgress = Math.min(1, scrollTop / effectiveScrollRange);

			const frameIndex = Math.min(frameCount - 1, Math.floor(scrubProgress * frameCount));

			requestAnimationFrame(() => render(frameIndex));
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function render(index: number) {
		if (!context || !canvas || !images[index]) return;

		// Get the CSS display dimensions (not the scaled canvas dimensions)
		const displayWidth = window.innerWidth;
		const displayHeight = window.innerHeight;

		// Clear using display dimensions (context is already scaled by DPR)
		context.clearRect(0, 0, displayWidth, displayHeight);

		const img = images[index];

		// Object-fit cover logic using display dimensions
		const scale = Math.max(displayWidth / img.width, displayHeight / img.height);
		const x = displayWidth / 2 - (img.width / 2) * scale;
		const y = displayHeight / 2 - (img.height / 2) * scale;

		context.drawImage(img, x, y, img.width * scale, img.height * scale);
	}

	function resize() {
		if (canvas) {
			// Get device pixel ratio for HD/Retina displays
			const dpr = window.devicePixelRatio || 1;

			// Set canvas internal resolution to match device pixels
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;

			// Scale the context to account for the higher resolution
			if (context) {
				context.scale(dpr, dpr);
			}

			render(0); // Re-render
		}
	}
</script>

<svelte:window on:resize={resize} />

<div class="bg-brand-dark">
	<!-- Wrapper -->
	<div class="h-[500vh] relative">
		<div class="sticky top-0 h-screen w-full overflow-hidden">
			<canvas bind:this={canvas} class="w-full h-full object-cover"></canvas>

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

			<!-- Text Overlay is now inside sticky container so it stays in view -->
			<TextOverlay {scrollProgress} />
		</div>
	</div>
</div>
