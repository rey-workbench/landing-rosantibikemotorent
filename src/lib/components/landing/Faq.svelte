<script lang="ts">
	let { lang = 'id' }: { lang?: 'id' | 'en' } = $props();

	let activeIndex = $state<number | null>(null);

	const faqs = $derived(
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
	);
</script>

<section class="py-20 md:py-32 relative z-10 border-t border-brand-border">
	<div class="container mx-auto px-4 md:px-10 max-w-4xl">
		<div class="text-center mb-16">
			<h2
				class="text-sm font-bold text-brand-highlight tracking-[0.2em] mb-4 uppercase flex items-center justify-center gap-2"
			>
				<span class="w-8 h-px bg-brand-highlight"></span>
				FAQ
				<span class="w-8 h-px bg-brand-highlight"></span>
			</h2>
			<h3
				class="text-4xl md:text-5xl font-black text-brand-fg leading-tight uppercase tracking-tighter"
			>
				{lang === 'en' ? 'Frequently Asked Questions' : 'Pertanyaan Umum'}
			</h3>
		</div>

		<div class="space-y-4">
			{#each faqs as faq, i}
				<div
					class="border border-brand-border rounded-2xl bg-brand-surface-soft overflow-hidden transition-colors hover:bg-brand-surface"
				>
					<button
						class="w-full flex items-center justify-between p-6 text-left focus:outline-none"
						onclick={() => (activeIndex = activeIndex === i ? null : i)}
						aria-expanded={activeIndex === i}
					>
						<span class="text-lg font-bold text-brand-fg pr-8">{faq.question}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-blue-500 transition-transform duration-300 {activeIndex === i
								? 'rotate-180'
								: ''}"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>

					<div
						class="grid transition-all duration-300 ease-in-out"
						style="grid-template-rows: {activeIndex === i ? '1fr' : '0fr'};"
					>
						<div class="overflow-hidden">
							<p class="p-6 pt-0 text-brand-muted leading-relaxed text-sm md:text-base">
								{faq.answer}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
