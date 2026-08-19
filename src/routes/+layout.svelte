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

	async function initLenis() {
		// Lenis smooth scroll khusus desktop (abaikan untuk reduced-motion & layar sentuh)
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (window.matchMedia('(pointer: coarse)').matches) return;

		const { default: Lenis } = await import('lenis');
		lenisInstance = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			smoothWheel: true,
			touchMultiplier: 2,
			autoRaf: true
		});
	}

	function initWebMcp() {
		// Registrasi WebMCP tool untuk browser AI Agents
		if (typeof window === 'undefined' || !('modelContext' in navigator)) return;

		try {
			const mc = (navigator as any).modelContext;
			if (typeof mc?.registerTool === 'function') {
				mc.registerTool({
					name: 'searchMotorcycles',
					description:
						'Search available rental motorcycles in Malang by brand, price, or transmission.',
					inputSchema: {
						type: 'object',
						properties: {
							query: { type: 'string', description: 'Motorcycle model or keywords' }
						}
					},
					execute: async ({ query }: { query?: string }) => {
						window.location.href = `/id/fleet${query ? `?search=${encodeURIComponent(query)}` : ''}`;
						return { status: 'navigating_to_fleet' };
					}
				});
			}
		} catch {
			// Lewati tanpa error jika browser tidak mendukung WebMCP
		}
	}

	onMount(() => {
		initLenis();
		initWebMcp();
	});

	onDestroy(() => {
		lenisInstance?.destroy();
	});
</script>

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

<!-- Accessibility: Skip to main content -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-999 bg-white text-black px-4 py-2 rounded font-bold shadow-md"
>
	Skip to content
</a>

<Preloader />
<Navbar />

<main id="main-content" class="min-h-screen">
	{@render children()}
</main>

<Footer />

