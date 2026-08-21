# AGENTS.md — Landing Zod Schemas

Panduan saat bekerja di `landing/src/lib/schemas`.

## Ringkasan & Tujuan

Definisi skema validasi Zod form input client-side.

## Komponen Kunci

- `transaksi.ts` — `CreateTransaksiSchema` (Validasi no WA, max length, regex aman).

## Konvensi & Best Practices

- Semua rule validasi (seperti panjang minimal, format angka) wajib sama persis dengan class-validator DTO di NestJS.
