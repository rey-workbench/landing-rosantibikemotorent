import type { RequestHandler } from '@sveltejs/kit';
import { DEFAULTS } from '$lib/constants';
import { BASE_URL } from '$lib/seo/types';
import { blogService, jenisMotorService } from '$lib/services';

export const GET: RequestHandler = async ({ fetch }) => {
	const baseUrl = BASE_URL || 'https://rosantibikemotorent.com';
	let fleetTable = '';
	let blogList = '';

	try {
		const [jenisRes, blogRes] = await Promise.all([
			jenisMotorService
				.getAll({ limit: DEFAULTS.ALL_ITEMS_LIMIT }, fetch)
				.catch(() => ({ data: [] })),
			blogService
				.getAll({ limit: DEFAULTS.ALL_ITEMS_LIMIT, status: 'PUBLISHED' }, fetch)
				.catch(() => ({ data: [] }))
		]);

		const jenisMotors = (jenisRes as any)?.data || [];
		if (jenisMotors.length > 0) {
			fleetTable = jenisMotors
				.map(
					(j: any) =>
						`| **${j.merk} ${j.model}** | ${j.cc || '-'} cc | Rp ${Number(j.hargaSewa || 0).toLocaleString('id-ID')} | [Detail Unit](${baseUrl}/id/fleet/${j.slug}) |`
				)
				.join('\n');
		}

		const blogs = (blogRes as any)?.data || [];
		if (blogs.length > 0) {
			blogList = blogs
				.map(
					(b: any) =>
						`- [${b.judul}](${baseUrl}/id/blog/${b.slug}): ${b.ringkasan || 'Panduan wisata Malang.'}`
				)
				.join('\n');
		}
	} catch (err) {
		console.error('Error fetching data for llms-full.txt:', err);
	}

	const fallbackFleet = `| **Honda PCX** | Tersedia | 150 cc | Rp 150.000 | [Detail](${baseUrl}/id/fleet/honda-pcx) |
| **Yamaha Lexi** | Tersedia | 125 cc | Rp 125.000 | [Detail](${baseUrl}/id/fleet/yamaha-lexi) |
| **Honda Vario 150** | Tersedia | 150 cc | Rp 120.000 | [Detail](${baseUrl}/id/fleet/honda-vario-150) |
| **Honda Vario 125** | Tersedia | 125 cc | Rp 120.000 | [Detail](${baseUrl}/id/fleet/honda-vario-125) |
| **Honda Scoopy** | Tersedia | 110 cc | Rp 100.000 | [Detail](${baseUrl}/id/fleet/honda-scoopy) |
| **Honda Beat Fi** | Tersedia | 110 cc | Rp 100.000 | [Detail](${baseUrl}/id/fleet/honda-beat-fi) |
| **Yamaha Soul GT** | Tersedia | 125 cc | Rp 80.000 | [Detail](${baseUrl}/id/fleet/yamaha-soul-gt) |`;

	const content = `# Rosantibike Motorent — Full Knowledge Base & Machine Readable Documentation

> Dokumentasi resmi terstruktur untuk AI agents, LLMs, dan automated search assistants.
> Canonical URL: ${baseUrl}
> Sinkronisasi Real-time: Aktif (Diambil langsung dari database API)

---

## 1. Profil & Informasi Kontak
- **Nama Usaha:** Rosantibike Motorent (Sewa & Rental Motor Malang)
- **Alamat:** Jl. Bauksit No.90C, Purwantoro, Kec. Blimbing, Kota Malang, Jawa Timur 65142
- **Koordinat Peta:** Latitude -7.9463, Longitude 112.6565
- **Jam Operasional:** 06:00 - 22:00 WIB (Buka Setiap Hari)
- **WhatsApp:** [+62 823-2152-313](https://wa.me/628232152313)
- **Email:** hello@rosantibike.com

---

## 2. Daftar Unit & Tarif Sewa Real-Time (Per 24 Jam)
Semua tarif dihitung per 24 jam (harian). Minimum durasi sewa adalah 1 hari (24 jam).

| Model Motor | Status | Kapasitas Mesin | Tarif / 24 Jam | Link Unit |
| :--- | :--- | :--- | :--- | :--- |
${fleetTable || fallbackFleet}

---

## 3. Fasilitas Sewa Gratis Setiap Unit
- 2 Helm SNI bersih & steril
- 2 Jas Hujan (mantel setelan celana & jaket)
- 1 Phone Holder stang motor
- Kunci Ganda / Gembok Cakram tambahan
- Gratis antar-jemput di Stasiun Malang Kota Baru, Stasiun Malang Kota Lama, Terminal Arjosari, & Hotel di Kota Malang.

---

## 4. Syarat Sewa (Tanpa Deposit Uang Tunai)
Penyewa wajib menjaminkan minimal 3 identitas asli (e-KTP, SIM C, BPJS/NPWP/KK/KTM/Paspor/Tiket Kereta/Pesawat/Booking Hotel).

---

## 5. Machine Action Endpoints untuk AI Agents
- **Online Booking Form:** ${baseUrl}/id/booking
- **English Booking Form:** ${baseUrl}/en/booking
- **Direct WhatsApp API:** https://wa.me/628232152313?text=Halo%20Rosantibike,%20saya%20ingin%20booking%20motor
- **Full LLM Index:** ${baseUrl}/llms.txt
- **Sitemap Index:** ${baseUrl}/sitemap.xml

---

## 6. Artikel Wisata & Panduan Malang
${blogList || `- [Panduan Sewa Motor Malang](${baseUrl}/id/blog)`}

---

## 7. FAQ Singkat
- **Berapa harga sewa motor di Malang per hari?** Mulai Rp 80.000/hari (Soul GT) hingga Rp 150.000/hari (PCX 150).
- **Apakah bisa antar jemput stasiun?** Ya, tim kami standby di pintu Stasiun Malang Kota Baru saat kereta tiba.
- **Bisa ke Bromo atau Batu?** Ya, seluruh armada prima dan siap rute pegunungan.
`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'max-age=3600, s-maxage=86400'
		}
	});
};
