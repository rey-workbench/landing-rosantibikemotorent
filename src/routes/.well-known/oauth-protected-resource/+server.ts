import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const metadata = {
		resource: 'https://api.rosantibikemotorent.com/api',
		authorization_servers: ['https://api.rosantibikemotorent.com'],
		scopes_supported: ['public:read', 'booking:create', 'admin:manage'],
		bearer_methods_supported: ['header'],
		resource_documentation: 'https://rosantibikemotorent.com/auth.md',
		identity_types_supported: ['anonymous', 'identity_assertion'],
		anonymous: {
			credential_types_supported: ['none']
		}
	};

	return new Response(JSON.stringify(metadata, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
