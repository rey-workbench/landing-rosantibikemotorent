<script lang="ts">
	import { page } from '$app/state';
	import { siteConfig } from '$lib/config';
	import { SeoHead } from '$lib/components/seo';
	import Faq from '$lib/components/landing/Faq.svelte';
	import { buildBreadcrumbSchema } from '$lib/seo/schema';

	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	const isEn = $derived(lang === 'en');
	const currentUrl = $derived(page.url.href);

	const title = $derived(
		isEn
			? 'Frequently Asked Questions (FAQ) - Malang Motorbike Rental | Rosantibike'
			: 'FAQ & Tanya Jawab Sewa Motor Malang | Rosantibike Motorent'
	);

	const description = $derived(
		isEn
			? 'Find answers to common questions about motorcycle rentals in Malang: prices, requirements, free delivery to Malang Station, helmets & raincoats included.'
			: 'Pertanyaan seputar sewa motor di Malang: harga rental mulai 60rb, syarat KTP/SIM, fasilitas gratis 2 helm & jas hujan, serta gratis antar jemput Stasiun Malang.'
	);

	const faqData = $derived(
		isEn
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
	);

	const breadcrumbSchema = $derived(
		buildBreadcrumbSchema([
			{ position: 1, name: 'Home', item: `https://rosantibikemotorent.com/${lang}` },
			{ position: 2, name: 'FAQ', item: currentUrl }
		])
	);

	const faqSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqData.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	});

	const schemas = $derived([breadcrumbSchema, faqSchema]);
</script>

<SeoHead
	{lang}
	meta={{
		title,
		description,
		canonicalUrl: currentUrl
	}}
	{schemas}
/>

<!-- Hero Header -->
<header class="pt-32 pb-12 md:pt-40 md:pb-16 px-6 md:px-10 bg-[#f5f5f7] border-b border-black/5 text-center">
	<div class="max-w-3xl mx-auto">
		<span class="inline-block px-3.5 py-1 mb-4 rounded-full bg-white border border-black/5 text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] shadow-xs">
			{isEn ? 'Support & Help' : 'Pusat Bantuan & FAQ'}
		</span>
		<h1 class="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">
			{isEn ? 'Frequently Asked Questions' : 'Pertanyaan yang Sering Diajukan'}
		</h1>
		<p class="text-base md:text-lg text-[#6b6b70] max-w-xl mx-auto leading-relaxed">
			{isEn
				? 'Everything you need to know about our motorbike rental service in Malang.'
				: 'Semua informasi penting seputar rental motor di Malang, syarat, harga, dan layanan antar jemput.'}
		</p>
	</div>
</header>

<!-- FAQ Accordion Component -->
<Faq {lang} />

<!-- Direct WhatsApp Help CTA -->
<section class="py-20 px-6 bg-[#f5f5f7] border-t border-black/5 text-center">
	<div class="max-w-xl mx-auto">
		<h2 class="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-3">
			{isEn ? 'Still have questions?' : 'Masih ada pertanyaan lain?'}
		</h2>
		<p class="text-sm md:text-base text-[#6b6b70] mb-8">
			{isEn
				? 'Our customer service team is ready to assist you 24/7 on WhatsApp.'
				: 'Tim customer service Rosantibike siap membantu Anda 24 jam via WhatsApp.'}
		</p>
		<a
			href="https://wa.me/{siteConfig.whatsapp}?text={encodeURIComponent(
				isEn
					? 'Hello Rosantibike, I have a question regarding motorbike rental in Malang.'
					: 'Halo Rosantibike, saya mau tanya informasi sewa motor di Malang.'
			)}"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-sm transition-all shadow-md active:scale-95"
		>
			<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
				<path
					d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
				/>
			</svg>
			<span>{isEn ? 'Chat on WhatsApp' : 'Tanya via WhatsApp'}</span>
		</a>
	</div>
</section>
