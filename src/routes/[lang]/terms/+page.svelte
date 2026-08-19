<script lang="ts">
	import { SeoHead } from '$lib/components/seo';
	import { page } from '$app/state';

	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
</script>

<SeoHead
	{lang}
	path="/terms"
	meta={{
		title: lang === 'en' ? 'Terms & Conditions | Rosantibike' : 'Syarat & Ketentuan | Rosantibike',
		description:
			lang === 'en'
				? 'Terms and conditions for motorcycle rental at Rosantibike.'
				: 'Syarat dan ketentuan penyewaan motor di Rosantibike Malang.'
	}}
/>

<div class="pt-32 pb-24 md:pt-40 md:pb-36 bg-white min-h-screen">
	<div class="container mx-auto px-6 md:px-10 max-w-4xl">
		<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight mb-8">
			{lang === 'en' ? 'Terms & Conditions' : 'Syarat & Ketentuan'}
		</h1>

		<div class="prose prose-lg text-[#6b6b70] max-w-none">
			<p>
				{lang === 'en'
					? 'Welcome to Rosantibike Motorent. By using our services, you agree to comply with and be bound by the following terms and conditions of use.'
					: 'Selamat datang di Rosantibike Motorent. Dengan menggunakan layanan kami, Anda setuju untuk mematuhi dan terikat oleh syarat dan ketentuan penggunaan berikut.'}
			</p>

			<h2>{lang === 'en' ? '1. Rental Requirements' : '1. Persyaratan Sewa'}</h2>
			<ul>
				<li>
					{lang === 'en'
						? 'A valid driver license (SIM C for Indonesians, International Driving Permit for foreigners) is mandatory.'
						: 'Wajib memiliki SIM C yang masih berlaku (atau International Driving Permit untuk WNA).'}
				</li>
				<li>
					{lang === 'en'
						? 'Renters must submit at least two valid original identification documents (e.g., e-KTP, Passport, KTM, KK) as a guarantee during the rental period.'
						: 'Penyewa wajib menyerahkan minimal 2 (dua) dokumen identitas asli (misal: e-KTP, Paspor, KTM, KK) sebagai jaminan selama masa sewa.'}
				</li>
			</ul>

			<h2>{lang === 'en' ? '2. Rental Period & Overtime' : '2. Masa Sewa & Keterlambatan'}</h2>
			<ul>
				<li>
					{lang === 'en'
						? 'The minimum rental period is 24 hours.'
						: 'Durasi minimal penyewaan adalah 24 jam.'}
				</li>
				<li>
					{lang === 'en'
						? 'Late returns will incur an overtime charge of IDR 15,000 per hour.'
						: 'Keterlambatan pengembalian akan dikenakan biaya overtime sebesar Rp 15.000 per jam.'}
				</li>
			</ul>

			<h2>{lang === 'en' ? '3. Usage & Liability' : '3. Penggunaan & Tanggung Jawab'}</h2>
			<ul>
				<li>
					{lang === 'en'
						? 'The motorcycle must only be used within the agreed service area (Malang, Batu, Bromo).'
						: 'Motor hanya boleh digunakan di dalam area layanan yang disepakati (Malang, Batu, Bromo).'}
				</li>
				<li>
					{lang === 'en'
						? 'The renter is fully responsible for any damage, loss, or theft of the motorcycle and its accessories during the rental period.'
						: 'Penyewa bertanggung jawab penuh atas segala kerusakan, kehilangan, atau pencurian motor beserta aksesorisnya selama masa sewa.'}
				</li>
			</ul>

			<p class="mt-12 text-sm">
				{lang === 'en' ? 'Last updated: August 2026' : 'Terakhir diperbarui: Agustus 2026'}
			</p>
		</div>
	</div>
</div>
