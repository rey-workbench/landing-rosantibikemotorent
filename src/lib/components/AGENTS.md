# AGENTS.md — Landing UI Components

Panduan saat bekerja di `landing/src/lib/components`.

## Ringkasan & Tujuan

Komponen antarmuka pengguna untuk portal publik.

## Komponen Kunci

- `booking/BookingForm.svelte` — Form multi-step untuk reservasi, terintegrasi Turnstile.
- `home/Hero.svelte` — Banner dan pencarian cepat.
- `home/PopularMotorGrid.svelte` — Katalog visual motor unggulan.

## Konvensi & Best Practices

- Gunakan lazy loading gambar untuk menjaga kecepatan LCP.
- Hindari CLS (Cumulative Layout Shift) pada saat font loading.
