# AGENTS.md — Landing Source Architecture

Panduan saat bekerja di `landing/src`.

## Ringkasan & Tujuan

Struktur utama kode frontend publik.

## Komponen Kunci

- `i18n/` — Definisi bahasa, di-generate oleh typesafe-i18n.
- `lib/components/` — UI portal publik (Hero, UnitCard, BookingForm).
- `lib/api/` — Client fetch publik ke backend.
- `routes/[lang]/` — Halaman dengan support path multi-bahasa (`/id/...` & `/en/...`).

## Konvensi & Best Practices

- Pastikan SEO tags selalu disuntikkan ke head dokumen SvelteKit pada tiap halaman rute.
