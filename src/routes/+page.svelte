<script lang="ts">
	import HeroSequence from '$lib/components/landing/HeroSequence.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Preloader from '$lib/components/ui/Preloader.svelte';
	import WhyChooseUs from '$lib/components/landing/WhyChooseUs.svelte';
	import AdventureMap from '$lib/components/landing/AdventureMap.svelte';
	import FleetGrid from '$lib/components/landing/Fleet.svelte';
	import Stats from '$lib/components/landing/Stats.svelte';
</script>

<Preloader />

<div class="bg-brand-dark min-h-screen text-white">
	<Navbar />

	<!-- Hero / Sequence Scroll -->
	<div class="relative z-0">
		<HeroSequence />
	</div>

	<!-- Content Overlap -->
	<div class="relative z-10 -mt-[100vh] bg-brand-dark shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
		<WhyChooseUs />
		<AdventureMap />
		<Stats />
		<FleetGrid />

		<!-- Footer -->
		<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
			<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
		</footer>
	</div>
</div>
