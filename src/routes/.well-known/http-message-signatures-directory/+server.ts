import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const jwks = {
		keys: [
			{
				kty: 'RSA',
				use: 'sig',
				alg: 'RS256',
				kid: 'rosantibike-sig-key-1',
				n: 'uN8_uN2_uJ3_rosantibike_signature_directory_key_public_token_sample_abc123',
				e: 'AQAB'
			}
		]
	};

	return new Response(JSON.stringify(jwks, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800'
		}
	});
};
