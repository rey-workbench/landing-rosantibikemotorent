import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const robotsTxt = `# Rosantibike Motorent - robots.txt
# https://rosantibikeamotorent.com

User-agent: *
Allow: /

# Block admin/private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Block booking success page (contains sensitive info)
Disallow: /*/booking/success

# Sitemap
Sitemap: https://rosantibikeamotorent.com/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400, s-maxage=604800'
		}
	});
};
