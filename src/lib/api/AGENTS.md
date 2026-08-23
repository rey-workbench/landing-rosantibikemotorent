# AGENTS.md — Landing API Layer

Panduan saat bekerja di `landing/src/lib/api`.

## Ringkasan & Tujuan

Fungsi integrasi HTTP ke backend publik NestJS.

## Komponen Kunci

- `client.ts` — HTTP client publik (tanpa token Admin).
- `transaksi.ts` — Kalkulasi estimasi harga, kirim data form booking + Turnstile token.
- `unit-motor.ts` — Fetch katalog motor yang tersedia untuk disewa.

## Konvensi & Best Practices

- Payload booking sensitif harus selalu menyertakan Turnstile token untuk proteksi anti-spam.
