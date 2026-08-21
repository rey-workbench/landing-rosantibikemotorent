# AGENTS.md — Landing State Stores

Panduan saat bekerja di `landing/src/lib/stores`.

## Ringkasan & Tujuan

Penyimpanan state reaktif client-side yang dibagi antarkomponen.

## Komponen Kunci

- `booking.ts` — Menyimpan data draft form reservasi saat pengguna berpindah step.
- `locale.ts` — Mendeteksi dan menyimpan preferensi bahasa.

## Konvensi & Best Practices

- State tidak boleh menyimpan informasi KTP sensitif di persistent storage tanpa enkripsi.
