<script lang="ts">
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { navigating } from '$app/state';
import { loadingState } from '$lib/stores';

let mounted = $state(false);
let progressInterval: ReturnType<typeof setInterval> | undefined;

onMount(() => {
	mounted = true;

	// Ensure initial load completes quickly
	if (!loadingState.isLoaded) {
		loadingState.progress = 100;
		setTimeout(() => (loadingState.isLoaded = true), 200);
	}
});

// Listen to SvelteKit navigation state
$effect(() => {
	if (navigating.to) {
		loadingState.isLoaded = false;
		loadingState.progress = 15;
		clearInterval(progressInterval);
		progressInterval = setInterval(() => {
			loadingState.progress = loadingState.progress >= 90 ? 90 : loadingState.progress + 15;
		}, 100);
	} else if (mounted) {
		loadingState.progress = 100;
		clearInterval(progressInterval);
		setTimeout(() => (loadingState.isLoaded = true), 300);
	}
});
</script>

{#if !loadingState.isLoaded && mounted}
	<!-- 
        Top Progress Bar (Sat Set Style)
        No overlay, immediate content visibility.
    -->
	<div class="fixed top-0 left-0 w-full h-0.75 z-200 pointer-events-none">
		<div
			class="h-full bg-brand-highlight transition-all duration-150 ease-out"
			style="width: {loadingState.progress}%"
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
