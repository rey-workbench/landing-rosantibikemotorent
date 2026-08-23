# AGENTS.md — Landing Types

Panduan saat bekerja di `landing/src/lib/types`.

## Ringkasan & Tujuan

Kontrak tipe data TypeScript untuk aplikasi publik.

## Komponen Kunci

- `api.ts` — Definisi hasil balasan JSON server.
- `motor.ts` — Skema bentuk objek katalog motor.
- `transaksi.ts` — DTO untuk pembuatan pesanan.

## Konvensi & Best Practices

- Gunakan tipe Zod infer (jika ada) untuk menghindari duplikasi deklarasi tipe.
