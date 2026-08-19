import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const agentCard = {
		schema_version: '0.1.0',
		name: 'RosantiBike Motorent Agent',
		description: 'Agentic commerce and autonomous motorcycle rental booking assistant for Malang & Batu.',
		url: 'https://rosantibikemotorent.com',
		provider: {
			name: 'RosantiBike Motorent',
			url: 'https://rosantibikemotorent.com'
		},
		capabilities: {
			commerce: true,
			streaming: true,
			tools: ['catalog_lookup', 'rate_calculator', 'create_booking']
		},
		extensions: [
			{
				uri: 'https://github.com/google-agentic-commerce/AP2/tree/v0.1.0',
				required: true,
				params: {
					roles: ['merchant']
				}
			}
		],
		endpoints: {
			api_catalog: 'https://rosantibikemotorent.com/.well-known/api-catalog',
			acp: 'https://rosantibikemotorent.com/.well-known/acp.json',
			ucp: 'https://rosantibikemotorent.com/.well-known/ucp',
			openapi: 'https://rosantibikemotorent.com/openapi.json',
			auth: 'https://rosantibikemotorent.com/auth.md'
		}
	};

	return new Response(JSON.stringify(agentCard, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
