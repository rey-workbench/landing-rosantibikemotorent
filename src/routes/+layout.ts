import type { LayoutLoad } from './$types';
import { isLocale, baseLocale } from '$i18n/i18n-util';

export const load: LayoutLoad = async ({ url }) => {
	const firstSegment = url.pathname.split('/')[1];
	const lang = isLocale(firstSegment) ? firstSegment : baseLocale;
	
	return { lang };
};
