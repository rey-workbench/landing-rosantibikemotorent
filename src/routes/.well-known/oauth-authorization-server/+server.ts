import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const oauthServerConfig = {
		issuer: 'https://api.rosantibikemotorent.com',
		authorization_endpoint: 'https://rosantibikemotorent.com/id/booking',
		token_endpoint: 'https://api.rosantibikemotorent.com/api/auth/login',
		jwks_uri: 'https://rosantibikemotorent.com/.well-known/jwks.json',
		response_types_supported: ['token', 'id_token', 'code'],
		grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'],
		scopes_supported: ['public:read', 'booking:create', 'admin:manage'],
		token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic', 'none'],
		code_challenge_methods_supported: ['S256', 'plain'],
		agent_auth: {
			skill: 'https://rosantibikemotorent.com/auth.md',
			register_uri: 'https://rosantibikemotorent.com/auth.md',
			identity_types_supported: ['anonymous', 'identity_assertion'],
			anonymous: {
				credential_types_supported: ['none'],
				claim_uri: 'https://api.rosantibikemotorent.com/api/jenis-motor'
			}
		}
	};

	return new Response(JSON.stringify(oauthServerConfig, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
