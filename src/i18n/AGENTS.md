# AGENTS.md — Landing Internationalization (i18n)

Panduan saat bekerja di `landing/src/i18n`.

## Ringkasan & Tujuan

Sistem lokalisasi multi-bahasa.

## Komponen Kunci

- `id/index.ts` — Bahasa Indonesia (Kamus Utama).
- `en/index.ts` — Bahasa Inggris.
- `formatters.ts` — Fungsi format custom berbasis `locale`.

## Konvensi & Best Practices

- Selalu gunakan `$LL.keyName()` di komponen Svelte.
- Jangan hardcode string di UI.
