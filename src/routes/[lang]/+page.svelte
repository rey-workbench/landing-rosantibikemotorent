<script lang="ts">
	import HeroVideo from '$lib/components/landing/HeroVideo.svelte';
	import WhyChooseUs from '$lib/components/landing/WhyChooseUs.svelte';
	import AdventureMap from '$lib/components/landing/AdventureMap.svelte';
	import FleetGrid from '$lib/components/landing/Fleet.svelte';
	import Stats from '$lib/components/landing/Stats.svelte';
	import Faq from '$lib/components/landing/Faq.svelte';
	import { SeoHead } from '$lib/components/seo';
	import { page } from '$app/state';
	import { LL } from '$i18n/i18n-svelte';
	import { buildFaqSchema, buildOrganizationSchema } from '$lib/seo/schema';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	const currentUrl = $derived(page.url.href);

	const orgSchema = $derived(buildOrganizationSchema());
	const faqSchema = $derived(
		buildFaqSchema(
			lang === 'en'
				? [
						{
							question: 'How much does it cost to rent a motorcycle in Malang per day?',
							answer:
								'Our motorcycle rental rates start from IDR 60,000 per day (24 hours) for standard scooters up to IDR 150,000 for Maxi/Sport types. Prices vary depending on the motorcycle model and rental duration.'
						},
						{
							question: 'What are the requirements for renting a motorcycle in Malang?',
							answer:
								"The main requirements are a valid ID card (e-KTP) and a valid driver's license (SIM C for Indonesian citizens). For foreign tourists, a valid Passport and a valid International Driving Permit (IDP) or license from your home country are required."
						},
						{
							question: 'Do you provide motorcycle delivery and pickup services?',
							answer:
								'Yes! We provide free delivery and pickup services to Malang Train Station (Stasiun Malang), Arjosari Bus Terminal, and hotels in the central Malang City area.'
						},
						{
							question: 'What is the minimum rental period?',
							answer:
								'The minimum rental period is 24 hours (1 day). We also offer weekly and monthly rentals with special discounted rates.'
						},
						{
							question: 'Are helmets and raincoats included?',
							answer:
								"Of course. Every motorcycle rental includes 2 clean SNI-certified helmets and 2 raincoats (poncho or set) for your safety and comfort while riding in Malang's rainy weather."
						}
					]
				: [
						{
							question: 'Berapa harga sewa motor di Malang per hari?',
							answer:
								'Harga sewa motor kami mulai dari Rp 60.000 per hari (24 jam) untuk motor matic standar, hingga Rp 150.000 untuk tipe Maxi/Sport. Harga bervariasi tergantung tipe motor dan durasi sewa.'
						},
						{
							question: 'Apa saja syarat sewa motor di Malang?',
							answer:
								'Syarat utama adalah wajib memiliki e-KTP asli dan SIM C yang masih berlaku. Untuk wisatawan asing, diwajibkan memiliki International Driving Permit atau SIM negara asal yang masih berlaku, beserta Paspor asli.'
						},
						{
							question: 'Apakah menyediakan layanan antar jemput motor (delivery)?',
							answer:
								'Ya! Kami menyediakan layanan antar-jemput motor gratis ke Stasiun Malang, Terminal Arjosari, dan hotel-hotel di area pusat Kota Malang.'
						},
						{
							question: 'Berapa durasi minimal penyewaan motor?',
							answer:
								'Durasi minimal penyewaan adalah 24 jam (1 hari). Kami juga melayani penyewaan mingguan dan bulanan dengan tarif khusus yang lebih hemat.'
						},
						{
							question: 'Apakah sudah termasuk helm dan jas hujan?',
							answer:
								'Tentu. Setiap penyewaan motor sudah termasuk 2 helm SNI bersih dan 2 jas hujan model ponco atau setelan untuk kenyamanan Anda berkendara di Malang yang sering hujan.'
						}
					]
		)
	);
</script>

<SeoHead
	{lang}
	path="/"
	meta={{
		title: `${$LL.hero_title()} | ${$LL.hero_tagline()}`,
		description: $LL.hero_tagline(),
		ogType: 'website'
	}}
	schemas={[orgSchema, faqSchema]}
/>

<!-- Hero / video background -->
<div class="relative z-0">
	<HeroVideo />
</div>

<!-- Content Overlap -->
<div class="relative z-10 mt-[-100vh] bg-brand-background">
	<WhyChooseUs />
	<AdventureMap />
	<Stats />
	<FleetGrid jenisMotors={data.featuredMotors} />
	<Faq {lang} />
</div>
