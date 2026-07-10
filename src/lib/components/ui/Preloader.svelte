<script lang="ts">
	import { loadingProgress, isLoaded } from '$lib/stores/loading';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	let mounted = false;
	let progressInterval: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		mounted = true;
		
		// Ensure initial load completes quickly
		if (!$isLoaded) {
			loadingProgress.set(100);
			setTimeout(() => isLoaded.set(true), 200);
		}
	});

	// Listen to SvelteKit navigation state
	$: if ($navigating) {
		isLoaded.set(false);
		loadingProgress.set(15);
		clearInterval(progressInterval);
		progressInterval = setInterval(() => {
			loadingProgress.update((n) => (n >= 90 ? 90 : n + 15));
		}, 100);
	} else if (mounted) {
		loadingProgress.set(100);
		clearInterval(progressInterval);
		setTimeout(() => isLoaded.set(true), 300);
	}
</script>

{#if !$isLoaded && mounted}
	<!-- 
        Top Progress Bar (Sat Set Style)
        No overlay, immediate content visibility.
    -->
	<div class="fixed top-0 left-0 w-full h-0.75 z-200 pointer-events-none">
		<div
			class="h-full bg-brand-highlight transition-all duration-150 ease-out"
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
