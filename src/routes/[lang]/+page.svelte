<script lang="ts">
	import HeroSequence from '$lib/components/landing/HeroSequence.svelte';
	import WhyChooseUs from '$lib/components/landing/WhyChooseUs.svelte';
	import AdventureMap from '$lib/components/landing/AdventureMap.svelte';
	import FleetGrid from '$lib/components/landing/Fleet.svelte';
	import Stats from '$lib/components/landing/Stats.svelte';
	import { SeoHead } from '$lib/components/seo';
	import { page } from '$app/stores';
	import { LL } from '$i18n/i18n-svelte';
	import { buildFaqSchema } from '$lib/seo/schema';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	let lang = $derived(($page.params.lang || 'id') as 'id' | 'en');
	let currentUrl = $derived($page.url.href);

	const faqSchema = buildFaqSchema([
		{
			question: 'What documents do I need to rent a motorcycle?',
			answer:
				"You need a valid driver's license (SIM C for motorcycle in Indonesia) and a valid ID card or passport."
		},
		{
			question: 'Is insurance included in the rental price?',
			answer:
				'Yes, all our rentals include basic travel insurance for your peace of mind during your ride.'
		},
		{
			question: 'Do you offer free delivery?',
			answer:
				'Yes, we offer free delivery to train stations, bus terminals, and hotels in Malang City area.'
		},
		{
			question: 'What is the minimum rental period?',
			answer:
				'Our minimum rental period is 24 hours. We also offer flexible daily, weekly, and monthly rates.'
		},
		{
			question: 'What payment methods do you accept?',
			answer:
				'We accept cash, bank transfer, and major digital payment methods including GoPay and OVO.'
		}
	]);
</script>

<SeoHead
	{lang}
	path="/"
	meta={{
		title: `${$LL.hero_title()} | ${$LL.hero_tagline()}`,
		description: $LL.hero_tagline(),
		ogType: 'website'
	}}
	schemas={[faqSchema]}
/>

<!-- Hero / Sequence Scroll -->
<div class="relative z-0">
	<HeroSequence />
</div>

<!-- Content Overlap -->
<div class="relative z-10 -mt-[100vh] bg-brand-dark section-shell">
	<WhyChooseUs />
	<AdventureMap />
	<Stats />
	<FleetGrid jenisMotors={data.featuredMotors} />
</div>
