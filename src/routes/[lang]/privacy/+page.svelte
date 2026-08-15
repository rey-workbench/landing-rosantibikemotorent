<script lang="ts">
	import { SeoHead } from '$lib/components/seo';
	import { page } from '$app/state';

	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
</script>

<SeoHead
	{lang}
	path="/privacy"
	meta={{
		title: lang === 'en' ? 'Privacy Policy | Rosantibike' : 'Kebijakan Privasi | Rosantibike',
		description:
			lang === 'en' ? 'Privacy policy for Rosantibike.' : 'Kebijakan privasi Rosantibike Malang.'
	}}
/>

<div class="pt-32 pb-24 md:pt-40 md:pb-36 bg-white min-h-screen">
	<div class="container mx-auto px-6 md:px-10 max-w-4xl">
		<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-8">
			{lang === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}
		</h1>

		<div
			class="prose prose-lg text-[#86868b] max-w-none"
		>
			<p>
				{lang === 'en'
					? 'Rosantibike Motorent respects your privacy and is committed to protecting your personal data.'
					: 'Rosantibike Motorent menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.'}
			</p>

			<h2>{lang === 'en' ? '1. Data Collection' : '1. Pengumpulan Data'}</h2>
			<p>
				{lang === 'en'
					? 'We collect personal information such as your name, contact details, and identification documents solely for the purpose of motorcycle rental processing and verification.'
					: 'Kami mengumpulkan informasi pribadi seperti nama, detail kontak, dan dokumen identitas semata-mata untuk tujuan pemrosesan dan verifikasi sewa motor.'}
			</p>

			<h2>{lang === 'en' ? '2. Data Usage' : '2. Penggunaan Data'}</h2>
			<p>
				{lang === 'en'
					? 'Your personal data is used to process bookings, arrange delivery/pickup, and communicate important updates regarding your rental.'
					: 'Data pribadi Anda digunakan untuk memproses pemesanan, mengatur pengiriman/penjemputan, dan mengomunikasikan pembaruan penting mengenai sewa Anda.'}
			</p>

			<h2>{lang === 'en' ? '3. Data Protection' : '3. Perlindungan Data'}</h2>
			<p>
				{lang === 'en'
					? 'We implement standard security measures to safeguard your physical documents and digital data. We do not sell or share your personal information with third parties without your explicit consent, except as required by law.'
					: 'Kami menerapkan langkah-langkah keamanan standar untuk melindungi dokumen fisik dan data digital Anda. Kami tidak menjual atau membagikan informasi pribadi Anda dengan pihak ketiga tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum.'}
			</p>

			<p class="mt-12 text-sm">
				{lang === 'en' ? 'Last updated: August 2026' : 'Terakhir diperbarui: Agustus 2026'}
			</p>
		</div>
	</div>
</div>
