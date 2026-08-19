import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const robotsTxt = `Content-Signal: search=yes, ai-input=yes, ai-train=no

# Rosantibike Motorent - robots.txt
# https://rosantibikemotorent.com

User-agent: *
Allow: /

# Block booking success page (contains customer booking receipt)
Disallow: /*/booking/success

# AI & Search Assistant Crawlers (Search & Citation Enabled)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap
Sitemap: https://rosantibikemotorent.com/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Content-Signal': 'search=yes, ai-input=yes, ai-train=no',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
