import type { FormattersInitializer } from 'typesafe-i18n';
import { date, number } from 'typesafe-i18n/formatters';
import type { Formatters, Locales } from './i18n-types';

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
	const formatters: Formatters = {
		// Formatter untuk angka biasa (ribuan/desimal)
		number: number(locale, { maximumFractionDigits: 0 }) as any,

		// Formatter khusus Rupiah (IDR)
		currency: number(locale, {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}) as any,

		// Formatter untuk tanggal singkat (contoh: 21 Agu 2026)
		dateShort: date(locale, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}) as any,

		// Formatter untuk tanggal lengkap dengan hari (contoh: Jumat, 21 Agustus 2026)
		dateLong: date(locale, {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}) as any
	};

	return formatters;
};
