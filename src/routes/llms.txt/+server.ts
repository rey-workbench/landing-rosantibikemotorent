import type { RequestHandler } from '@sveltejs/kit';
import { BASE_URL } from '$lib/seo/types';
import { jenisMotorApi, blogApi } from '$lib/api';

export const GET: RequestHandler = async () => {
	const baseUrl = BASE_URL || 'https://rosantibikemotorent.com';

	let fleetLinksId = '';
	let blogLinksId = '';
	let fleetLinksEn = '';
	let blogLinksEn = '';

	try {
		const [jenisRes, blogRes] = await Promise.all([
			jenisMotorApi.getAll().catch(() => ({ data: [] })),
			blogApi.getAll({ limit: 100, status: 'PUBLISHED' }).catch(() => ({ data: [] }))
		]);

		const jenisMotors = jenisRes?.data || [];
		if (jenisMotors.length > 0) {
			fleetLinksId = jenisMotors
				.map(
					(j: any) =>
						`- [${j.merk} ${j.model}](${baseUrl}/id/fleet/${j.slug}): ${j.cc || ''}cc, transmisi ${j.transmisi || 'Matic'}, sewa mulai Rp ${Number(j.hargaSewa || 0).toLocaleString('id-ID')}/hari.`
				)
				.join('\n');
			fleetLinksEn = jenisMotors
				.map(
					(j: any) =>
						`- [${j.merk} ${j.model}](${baseUrl}/en/fleet/${j.slug}): ${j.cc || ''}cc, transmission ${j.transmisi || 'Automatic'}, rental starts from IDR ${Number(j.hargaSewa || 0).toLocaleString('id-ID')}/day.`
				)
				.join('\n');
		}

		const blogs = blogRes?.data || [];
		if (blogs.length > 0) {
			blogLinksId = blogs
				.map(
					(b: any) =>
						`- [${b.judul}](${baseUrl}/id/blog/${b.slug}): ${b.ringkasan || 'Panduan wisata dan tips berkendara di Malang & sekitarnya.'}`
				)
				.join('\n');
			blogLinksEn = blogs
				.map(
					(b: any) =>
						`- [${b.judul}](${baseUrl}/en/blog/${b.slug}): ${b.ringkasan || 'Travel guides and riding tips in Malang & Bromo.'}`
				)
				.join('\n');
		}
	} catch (err) {
		console.error('Failed to load dynamic sitemap items for llms.txt:', err);
	}

	const content = `# Rosantibike Motorent

> Rosantibike Motorent adalah penyedia layanan rental dan sewa motor profesional di Kota Malang dan Batu, Jawa Timur, Indonesia. Menyediakan berbagai tipe motor matic, manual, dan trail dengan fasilitas helm SNI, jas hujan, dan layanan antar-jemput stasiun/terminal/hotel.

## Halaman Utama & Pemesanan (ID)

- [Beranda / Home](${baseUrl}/id): Halaman utama layanan sewa motor Malang.
- [Katalog Armada Motor](${baseUrl}/id/fleet): Seluruh daftar pilihan unit motor dan tarif rental harian/mingguan.
- [Formulir Booking Online](${baseUrl}/id/booking): Pemesanan rental motor secara langsung dengan pemilihan tanggal sewa dan lokasi penyerahan unit.
- [FAQ & Pertanyaan Umum](${baseUrl}/id/faq): Tanya jawab lengkap tentang syarat, harga, dan layanan antar jemput.
- [Blog & Artikel Wisata](${baseUrl}/id/blog): Daftar artikel, panduan wisata Malang & Bromo, serta tips berkendara.

### Detail Armada Motor (ID)
${
	fleetLinksId ||
	`- [Honda Beat](${baseUrl}/id/fleet/honda-beat-fi): Motor matic hemat bahan bakar.
- [Honda Vario 125](${baseUrl}/id/fleet/honda-vario-125): Motor matic bertenaga dan nyaman.
- [Honda Scoopy](${baseUrl}/id/fleet/honda-scoopy): Motor matic retro stylish.
- [Honda PCX 160](${baseUrl}/id/fleet/honda-pcx): Motor matic premium.`
}

### Artikel & Panduan Wisata (ID)
${
	blogLinksId ||
	`- [Panduan Memilih Motor untuk Pemula](${baseUrl}/id/blog/panduan-memilih-motor-yang-tepat-untuk-pemula): Tips memilih motor yang sesuai medan wisata Malang & Batu.
- [Tips Merawat Motor Musim Hujan](${baseUrl}/id/blog/tips-merawat-motor-agar-tetap-prima-selama-musim-hujan): Panduan keselamatan berkendara di kondisi hujan.`
}

## Main Pages & Booking (EN)

- [Home (EN)](${baseUrl}/en): Motorcycle rental service in Malang & Batu.
- [Fleet (EN)](${baseUrl}/en/fleet): Complete motorcycle catalogue and daily rental rates.
- [Booking (EN)](${baseUrl}/en/booking): Online motorcycle reservation form.
- [FAQ (EN)](${baseUrl}/en/faq): Frequently asked questions about pricing, requirements, and pickup services.
- [Blog (EN)](${baseUrl}/en/blog): Malang & Mount Bromo travel guides.

### Motorcycle Fleet (EN)
${
	fleetLinksEn ||
	`- [Honda Beat](${baseUrl}/en/fleet/honda-beat-fi): Fuel-efficient automatic scooter.
- [Honda Vario 125](${baseUrl}/en/fleet/honda-vario-125): Powerful and comfortable automatic scooter.
- [Honda Scoopy](${baseUrl}/en/fleet/honda-scoopy): Stylish retro automatic scooter.
- [Honda PCX 160](${baseUrl}/en/fleet/honda-pcx): Premium automatic scooter.`
}

### Travel Guides & Articles (EN)
${
	blogLinksEn ||
	`- [Guide to Choosing a Motorcycle for Beginners](${baseUrl}/en/blog/panduan-memilih-motor-yang-tepat-untuk-pemula): Tips for choosing the right motorcycle for Malang & Batu.
- [Rainy Season Riding Tips](${baseUrl}/en/blog/tips-merawat-motor-agar-tetap-prima-selama-musim-hujan): Riding safety guide in rainy conditions.`
}

## Informasi Kontak & Operasional

- [Website Resmi](${baseUrl}): Website resmi Rosantibike Motorent.
- [Chat WhatsApp](${baseUrl}/id/booking): Layanan pelanggan resmi (+62 823-2152-313).
- [Peta Lokasi](https://maps.google.com/?q=-7.9463,112.6565): Jl. Bauksit No.90C, Malang, Jawa Timur.
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=86400'
		}
	});
};
