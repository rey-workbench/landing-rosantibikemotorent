import type { RequestHandler } from '@sveltejs/kit';
import { BASE_URL } from '$lib/seo/types';
import { jenisMotorApi, blogApi } from '$lib/api';

export const GET: RequestHandler = async () => {
	const baseUrl = BASE_URL || 'https://rosantibikemotorent.com';

	let fleetLinks = '';
	let blogLinks = '';

	try {
		const [jenisRes, blogRes] = await Promise.all([
			jenisMotorApi.getAll().catch(() => ({ data: [] })),
			blogApi.getAll({ limit: 100, status: 'PUBLISHED' }).catch(() => ({ data: [] }))
		]);

		const jenisMotors = jenisRes?.data || [];
		if (jenisMotors.length > 0) {
			fleetLinks = jenisMotors
				.map(
					(j: any) =>
						`- [${j.merk} ${j.model}](${baseUrl}/id/fleet/${j.slug}): ${j.cc || ''}cc, transmisi ${j.transmisi || 'Matic'}, sewa mulai Rp ${Number(j.hargaSewa || 0).toLocaleString('id-ID')}/hari.`
				)
				.join('\n');
		}

		const blogs = blogRes?.data || [];
		if (blogs.length > 0) {
			blogLinks = blogs
				.map(
					(b: any) =>
						`- [${b.judul}](${baseUrl}/id/blog/${b.slug}): ${b.ringkasan || 'Panduan wisata dan tips berkendara di Malang & sekitarnya.'}`
				)
				.join('\n');
		}
	} catch (err) {
		console.error('Failed to load dynamic sitemap items for llms.txt:', err);
	}

	const content = `# Rosantibike Motorent

> Rosantibike Motorent adalah penyedia layanan rental dan sewa motor profesional di Kota Malang dan Batu, Jawa Timur, Indonesia. Menyediakan berbagai tipe motor matic, manual, dan trail dengan fasilitas helm SNI, jas hujan, dan layanan antar-jemput stasiun/terminal/hotel.

## Halaman Utama & Pemesanan

- [Beranda / Home](${baseUrl}/id): Halaman utama layanan sewa motor Malang.
- [Katalog Armada Motor](${baseUrl}/id/fleet): Seluruh daftar pilihan unit motor dan tarif rental harian/mingguan.
- [Formulir Booking Online](${baseUrl}/id/booking): Pemesanan rental motor secara langsung dengan pemilihan tanggal sewa dan lokasi penyerahan unit.
- [Blog & Artikel Wisata](${baseUrl}/id/blog): Daftar artikel, panduan wisata Malang & Bromo, serta tips berkendara.
- [Syarat & Ketentuan Rental](${baseUrl}/id/terms): Ketentuan sewa motor, persyaratan identitas (KTP/SIM C), sistem deposit, dan aturan sewa.
- [Kebijakan Privasi](${baseUrl}/id/privacy): Informasi mengenai perlindungan data pribadi dan privasi pelanggan.

## Detail Armada Motor (Sesuai Katalog)
${
	fleetLinks ||
	`- [Honda Beat](${baseUrl}/id/fleet/honda-beat-fi): Motor matic hemat bahan bakar untuk keliling kota Malang.
- [Honda Vario 125](${baseUrl}/id/fleet/honda-vario-125): Motor matic bertenaga dan nyaman untuk wisata harian.
- [Honda Scoopy](${baseUrl}/id/fleet/honda-scoopy): Motor matic retro stylish dan lincah.
- [Honda PCX 160](${baseUrl}/id/fleet/honda-pcx): Motor matic premium untuk perjalanan jauh dan touring.
- [Yamaha NMAX](${baseUrl}/id/fleet/yamaha-lexi): Motor matic maxi bertenaga dan nyaman untuk tanjakan.`
}

## Artikel & Panduan Wisata Terbaru
${
	blogLinks ||
	`- [Panduan Memilih Motor untuk Pemula](${baseUrl}/id/blog/panduan-memilih-motor-yang-tepat-untuk-pemula): Tips memilih motor yang sesuai medan wisata Malang & Batu.
- [Tips Merawat Motor Musim Hujan](${baseUrl}/id/blog/tips-merawat-motor-agar-tetap-prima-selama-musim-hujan): Panduan keselamatan berkendara di kondisi hujan.`
}

## Informasi Kontak & Operasional

- [Website Resmi](${baseUrl}): Website resmi Rosantibike Motorent.
- [Chat WhatsApp](${baseUrl}/id/booking): Layanan pelanggan resmi (+62 823-2152-313).
- [Peta Lokasi](https://maps.google.com/?q=-7.9463,112.6565): Jl. Bauksit No.90C, Malang, Jawa Timur.

## Versi Bahasa Inggris (English Pages)

- [Home (EN)](${baseUrl}/en): Motorcycle rental service in Malang & Batu.
- [Fleet (EN)](${baseUrl}/en/fleet): Complete motorcycle catalogue and daily rental rates.
- [Booking (EN)](${baseUrl}/en/booking): Online motorcycle reservation form.
- [Blog (EN)](${baseUrl}/en/blog): Malang & Mount Bromo travel guides.
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=86400'
		}
	});
};
