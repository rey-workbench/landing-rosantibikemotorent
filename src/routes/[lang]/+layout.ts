import type { LayoutLoad } from './$types';
import { setLocale } from '$i18n/i18n-svelte';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { Locales } from '$i18n/i18n-types';

export const load: LayoutLoad = async ({ params }) => {
	const locale = params.lang as Locales;
	
	// Load the translations for the current locale
	await loadLocaleAsync(locale);
	
	// Set the locale in typesafe-i18n stores
	setLocale(locale);

	return { locale };
};
