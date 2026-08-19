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
	event.locals.locale = locale;

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('lang="id"', `lang="${locale}"`)
				.replace('%lang%', locale)
				.replace('%dir%', 'ltr'),
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});
};

const handleSecurity: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com",
			"img-src 'self' data: https:",
			"connect-src 'self' wss: https:",
			"media-src 'self'",
			"frame-ancestors 'none'"
		].join('; ')
	);
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	response.headers.set('Vary', 'Accept');
	response.headers.set(
		'Link',
		'</llms.txt>; rel="describedby", </llms-full.txt>; rel="alternate"; type="text/markdown", </.well-known/api-catalog>; rel="service-desc"; type="application/linkset+json", </auth.md>; rel="authorisation"'
	);
	return response;
};

const handleMarkdownNegotiation: Handle = async ({ event, resolve }) => {
	const accept = event.request.headers.get('accept') || '';
	const pathname = event.url.pathname;
	const isMarkdownRequested =
		accept.includes('text/markdown') ||
		pathname.endsWith('.md') ||
		event.url.searchParams.get('format') === 'markdown';

	// Serve Markdown representation to AI Agents requesting text/markdown
	if (
		isMarkdownRequested &&
		!pathname.startsWith('/api') &&
		!pathname.startsWith('/_app') &&
		!pathname.includes('.')
	) {
		const targetUrl = new URL('/llms-full.txt', event.url.origin);
		const llmsResponse = await event.fetch(targetUrl);
		if (llmsResponse.ok) {
			const markdownBody = await llmsResponse.text();
			return new Response(markdownBody, {
				status: 200,
				headers: {
					'Content-Type': 'text/markdown; charset=utf-8',
					'Vary': 'Accept',
					'Cache-Control': 'public, max-age=3600, s-maxage=86400'
				}
			});
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleMarkdownNegotiation, handleSecurity, handleLocale);

export const handleError = ({ error }: { error: unknown }) => {
	console.error('Landing server error:', error);
	return {
		message: 'Terjadi kesalahan sistem.'
	};
};
