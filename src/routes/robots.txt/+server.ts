import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const robotsTxt = `# Rosantibike Motorent - robots.txt
# https://rosantibikemotorent.com

User-agent: *
Allow: /

# Block booking success page (contains customer booking receipt)
Disallow: /*/booking/success

# Sitemap
Sitemap: https://rosantibikemotorent.com/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400, s-maxage=604800'
		}
	});
};
