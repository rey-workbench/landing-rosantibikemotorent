# AGENTS.md — Landing Utilities

Panduan saat bekerja di `landing/src/lib/utils`.

## Ringkasan & Tujuan

Berbagai alat bantu formatting untuk frontend publik.

## Komponen Kunci

- `currency.ts` — Memformat harga ke format mata uang spesifik negara (IDR dsb).
- `date.ts` — Format perhitungan hari sewa.
- `seo.ts` — Meta tags JSON-LD builder.

## Konvensi & Best Practices

- Gunakan date-fns untuk kalkulasi jarak hari antar kalender secara akurat.
