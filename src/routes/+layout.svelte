<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Preloader from '$lib/components/ui/Preloader.svelte';
	import { setLocale } from '$i18n/i18n-svelte';

	import type { Locales } from '$i18n/i18n-types';

	let { data, children } = $props();
	let layoutData = $derived(data as { lang?: Locales; organizationSchema?: object });

	$effect(() => {
		if (layoutData.lang) {
			setLocale(layoutData.lang);
		}
	});

	let lenisInstance: { destroy: () => void } | null = null;

	onMount(() => {
		// Lenis hanya untuk smooth wheel di desktop — lewati untuk touch & reduced-motion
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (window.matchMedia('(pointer: coarse)').matches) return;

		import('lenis').then(({ default: Lenis }) => {
			lenisInstance = new Lenis({
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: 'vertical',
				smoothWheel: true,
				touchMultiplier: 2,
				autoRaf: true
			});
		});
	});

	onDestroy(() => {
		lenisInstance?.destroy();
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

<main id="main-content" class="min-h-screen">
	{@render children()}
</main>

<Footer />

<svelte:head>
	<script>
		(function () {
			const theme = localStorage.getItem('theme') || 'light';
			document.documentElement.setAttribute('data-theme', theme);
		})();
	</script>
	{#if layoutData.organizationSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(layoutData.organizationSchema)}</script>`}
	{/if}
</svelte:head>
