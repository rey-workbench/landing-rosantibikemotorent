<script lang="ts">
	import HeroSequence from '$lib/components/landing/HeroSequence.svelte';
	import WhyChooseUs from '$lib/components/landing/WhyChooseUs.svelte';
	import AdventureMap from '$lib/components/landing/AdventureMap.svelte';
	import FleetGrid from '$lib/components/landing/Fleet.svelte';
	import Stats from '$lib/components/landing/Stats.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<!-- Hero / Sequence Scroll -->
<div class="relative z-0">
	<HeroSequence />
</div>

<!-- Content Overlap -->
<div class="relative z-10 -mt-[100vh] bg-brand-dark shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
	<WhyChooseUs />
	<AdventureMap />
	<Stats />
	<FleetGrid jenisMotors={data.featuredMotors} />
</div>
