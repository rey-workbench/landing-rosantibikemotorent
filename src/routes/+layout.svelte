<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Lenis from '@studio-freight/lenis';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Preloader from '$lib/components/ui/Preloader.svelte';
	import { setLocale } from '$i18n/i18n-svelte';

	let { data, children } = $props();

	$effect(() => {
		if (data.lang) {
			setLocale(data.lang);
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
	});
</script>

<Preloader />
<Navbar />

<main class="min-h-screen bg-brand-dark text-white">
	{@render children()}
</main>

<Footer />
