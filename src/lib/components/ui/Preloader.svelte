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
			class="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-150 ease-out"
			style="width: {$loadingProgress}%"
		></div>

		<!-- Subtle Shimmer Aura at the top -->
		<div
			class="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none opacity-50"
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
