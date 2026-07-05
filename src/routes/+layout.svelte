<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Preloader from '$lib/components/ui/Preloader.svelte';
	import { setLocale } from '$i18n/i18n-svelte';
	import { websocketService } from '$lib/services/websocket';
	import type { Locales } from '$i18n/i18n-types';

	let { data, children } = $props();
	let layoutData = $derived(data as { lang?: Locales; organizationSchema?: object });

	$effect(() => {
		if (layoutData.lang) {
			setLocale(layoutData.lang);
		}
	});

	onMount(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			smoothWheel: true,
			touchMultiplier: 2
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		websocketService.connect();

		return () => {
			websocketService.disconnect();
		};
	});
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-999 bg-white text-black px-4 py-2 rounded font-bold"
>
	Skip to content
</a>

<Preloader />
<Navbar />

<main id="main-content" class="min-h-screen bg-brand-dark text-white">
	{@render children()}
</main>

<Footer />

<svelte:head>
	{#if layoutData.organizationSchema}
		<script type="application/ld+json">
{JSON.stringify(layoutData.organizationSchema)}
		</script>
	{/if}
</svelte:head>
