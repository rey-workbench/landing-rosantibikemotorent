# AGENTS.md — Landing Multi-Language Routes

Panduan saat bekerja di `landing/src/routes/[lang]`.

## Ringkasan & Tujuan

Rute publik (Pages) yang meng-handle segmentasi bahasa.

## Komponen Kunci

- `/` (`+page.svelte`) — Halaman beranda utama promosi motor.
- `/sewa/` — Katalog filter unit motor.
- `/booking/` — Flow pesanan multi-tahap.
- `/blog/` — Konten artikel.

## Konvensi & Best Practices

- Gunakan param `[lang]` di url untuk memandu locale yang dirender ke klien (`$LL`).
