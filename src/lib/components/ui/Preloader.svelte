<script>
	import { loadingProgress, isLoaded } from '$lib/stores/loading';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let mounted = false;

	onMount(() => {
		mounted = true;

		// Simulated progress for non-home pages
		if ($page.url.pathname !== '/') {
			const interval = setInterval(() => {
				loadingProgress.update((n) => {
					if (n >= 100) {
						clearInterval(interval);
						setTimeout(() => isLoaded.set(true), 200);
						return 100;
					}
					return n + 10; // Faster "sat set" speed
				});
			}, 20);
		} else {
			// Safety timeout for home page
			const timeout = setTimeout(() => {
				if (!$isLoaded) isLoaded.set(true);
			}, 3000); // Shorter safety timeout
			return () => clearTimeout(timeout);
		}
	});
</script>

{#if !$isLoaded && mounted}
	<!-- 
        Top Progress Bar (Sat Set Style)
        No overlay, immediate content visibility.
    -->
	<div class="fixed top-0 left-0 w-full h-[3px] z-[200] pointer-events-none">
		<div
			class="h-full bg-white transition-all duration-150 ease-out"
			style="width: {$loadingProgress}%"
		></div>

		<!-- No glow overlay -->
		<div
			class="absolute top-0 left-0 w-full h-20 pointer-events-none opacity-0"
			transition:fade={{ duration: 500 }}
		></div>
	</div>
{/if}

<style>
	/* Shimmer animation utility if needed for content */
	:global(.shimmer) {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.05) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
