import type { RequestHandler } from '@sveltejs/kit';
import { BASE_URL } from '$lib/seo/types';

interface SitemapUrl {
	path: string;
	changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
	priority: number;
	lastmod?: string;
}

const staticUrls: SitemapUrl[] = [
	{ path: '', changefreq: 'daily', priority: 1.0 },
	{ path: '/fleet', changefreq: 'weekly', priority: 0.9 },
	{ path: '/blog', changefreq: 'weekly', priority: 0.8 },
	{ path: '/booking', changefreq: 'monthly', priority: 0.7 }
];

function generateUrlElement(url: SitemapUrl, isId: boolean): string {
	const lang = isId ? 'id' : 'en';
	const langPath = lang + (url.path || '');
	const fullUrl = `${BASE_URL}/${langPath}`;
	const lastmod = url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : '';
	const alternates = `
		<xhtml:link rel="alternate" hreflang="id" href="${BASE_URL}/id${url.path}"/>
		<xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en${url.path}"/>`;

	return `
	<url>
		<loc>${fullUrl}</loc>${lastmod}
		<changefreq>${url.changefreq}</changefreq>
		<priority>${url.priority.toFixed(1)}</priority>${alternates}
	</url>`.trim();
}

export const GET: RequestHandler = async () => {
	const idUrls = staticUrls.map((url) => generateUrlElement(url, true)).join('\n');
	const enUrls = staticUrls.map((url) => generateUrlElement(url, false)).join('\n');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${idUrls}
${enUrls}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600, s-maxage=86400'
		}
	});
};
