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

<section class="py-24 md:py-36 relative z-10 border-t border-black/5 bg-white">
	<div class="container mx-auto px-6 md:px-10 max-w-245">
		<div class="text-left md:text-center mb-16">
			<h2 class="text-4xl md:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-tight">
				{lang === 'en' ? 'Frequently Asked Questions.' : 'Pertanyaan Umum (FAQ) Sewa Motor Malang'}
			</h2>
		</div>

		<div class="divide-y divide-black/10 border-y">
			{#each faqs as faq, i}
				<div class="py-6 transition-colors">
					<button
						class="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
						onclick={() => (activeIndex = activeIndex === i ? null : i)}
						aria-expanded={activeIndex === i}
					>
						<span
							class="text-xl md:text-2xl font-semibold text-[#1d1d1f] pr-8 group-hover:text-apple-blue transition-colors"
							>{faq.question}</span
						>
						<span
							class="text-2xl text-[#6b6b70] font-light transition-transform duration-300 {activeIndex ===
							i
								? 'rotate-45'
								: ''}"
						>
							+
						</span>
					</button>
					{#if activeIndex === i}
						<div class="mt-4 pr-8 text-lg md:text-xl text-[#6b6b70] leading-relaxed font-normal">
							<p>{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
