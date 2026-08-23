import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const catalog = {
		linkset: [
			{
				anchor: 'https://api.rosantibikemotorent.com/api',
				'service-desc': [
					{
						href: 'https://api.rosantibikemotorent.com/api/docs-json',
						type: 'application/openapi+json'
					}
				],
				'service-doc': [
					{
						href: 'https://api.rosantibikemotorent.com/api/docs',
						type: 'text/html'
					},
					{
						href: 'https://rosantibikemotorent.com/llms.txt',
						type: 'text/markdown'
					}
				],
				status: [
					{
						href: 'https://api.rosantibikemotorent.com/api/health'
					}
				]
			}
		]
	};

	return new Response(JSON.stringify(catalog, null, 2), {
		headers: {
			'Content-Type': 'application/linkset+json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
