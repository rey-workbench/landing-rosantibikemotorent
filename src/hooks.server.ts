import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { detectLocale, isLocale } from '$i18n/i18n-util';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import type { Locales } from '$i18n/i18n-types';

const getLocale = (event: RequestEvent): Locales => {
	// 1. Check URL path
	const pathname = event.url.pathname;
	const firstSegment = pathname.split('/')[1];
	if (firstSegment && isLocale(firstSegment)) {
		return firstSegment as Locales;
	}

	// 2. Check cookie
	const cookieLocale = event.cookies.get('locale');
	if (cookieLocale && isLocale(cookieLocale)) return cookieLocale as Locales;

	// 3. Check Accept-Language header
	const acceptLanguageHeader = event.request.headers.get('accept-language');
	if (acceptLanguageHeader) {
		const detector = initAcceptLanguageHeaderDetector(event.request);
		return detectLocale(detector);
	}

	return 'id'; // Default
};

const handleLocale: Handle = async ({ event, resolve }) => {
	const locale = getLocale(event);
	(event.locals as any).locale = locale;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', locale).replace('%dir%', 'ltr')
	});
};

export const handle = sequence(handleLocale);
