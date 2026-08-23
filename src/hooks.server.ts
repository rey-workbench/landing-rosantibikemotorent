import { sequence } from '@sveltejs/kit/hooks';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { detectLocale, isLocale } from '$i18n/i18n-util';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import type { Locales } from '$i18n/i18n-types';

const getLocale = (event: RequestEvent): Locales => {
	const segment = event.url.pathname.split('/')[1];
	if (segment && isLocale(segment)) return segment as Locales;
	const cookie = event.cookies.get('locale');
	if (cookie && isLocale(cookie)) return cookie as Locales;
	const accept = event.request.headers.get('accept-language');
	return accept ? detectLocale(initAcceptLanguageHeaderDetector(event.request)) : 'id';
};

const handleLocale: Handle = async ({ event, resolve }) => {
	const p = event.url.pathname;
	if (/^\/(api|_app|\.well-known|platform)/.test(p) || p.includes('.')) return resolve(event);

	const locale = getLocale(event);
	const segment = p.split('/')[1];

	if (!segment || !isLocale(segment)) {
		return new Response(null, {
			status: 308,
			headers: { Location: `/${locale}${p === '/' ? '' : p}${event.url.search}` }
		});
	}

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
	const p = event.url.pathname;

	const cache = p.startsWith('/_app/immutable/')
		? 'public, max-age=31536000, immutable'
		: /\.(webp|avif|png|jpg|jpeg|svg|webm|mp4|woff2|woff|ttf|ico|txt)$/i.test(p)
			? 'public, max-age=2592000, stale-while-revalidate=86400'
			: null;
	if (cache) response.headers.set('Cache-Control', cache);

	const connectSrc = dev
		? "connect-src 'self' http: ws: wss: https: https://cloudflareinsights.com"
		: "connect-src 'self' wss: https: https://cloudflareinsights.com";

	const headers: Record<string, string> = {
		'Content-Security-Policy':
			`default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; ${connectSrc}; media-src 'self'; frame-src 'self' https://challenges.cloudflare.com; frame-ancestors 'none'`,
		'X-Frame-Options': 'DENY',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
		'Cross-Origin-Opener-Policy': 'same-origin',
		Vary: 'Accept',
		'Content-Signal': 'search=yes, ai-input=yes, ai-train=no',
		Link: '</llms.txt>; rel="describedby", </llms-full.txt>; rel="alternate"; type="text/markdown", </.well-known/api-catalog>; rel="service-desc"; type="application/linkset+json", </.well-known/oauth-protected-resource>; rel="oauth-protected-resource", </.well-known/ucp>; rel="ucp", </auth.md>; rel="authorisation"'
	};

	if (!dev) {
		headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
	}
	for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);

	return response;
};

const handleMarkdownNegotiation: Handle = async ({ event, resolve }) => {
	const accept = event.request.headers.get('accept') || '';
	const p = event.url.pathname;
	if (
		(accept.includes('text/markdown') ||
			p.endsWith('.md') ||
			event.url.searchParams.get('format') === 'markdown') &&
		!/^\/(api|_app)/.test(p) &&
		!p.includes('.')
	) {
		const res = await event.fetch(new URL('/llms-full.txt', event.url.origin));
		if (res.ok) {
			return new Response(await res.text(), {
				status: 200,
				headers: {
					'Content-Type': 'text/markdown; charset=utf-8',
					Vary: 'Accept',
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
	return { message: 'Terjadi kesalahan sistem.' };
};
