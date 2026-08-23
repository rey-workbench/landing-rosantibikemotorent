import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const jwks = {
		keys: [
			{
				kty: 'RSA',
				use: 'sig',
				alg: 'RS256',
				kid: 'rosantibike-sig-key-1',
				n: 'oq-LuQxWFm5CfeiQIvN_gCFo8QnekJohcP02hTDrzfHbNR1gJtNmP71qznZgZHnrFzC4zyI73isJNEyUzEfVvCvRmmQ9qti7_Uy-LjvHIKSY4MaSI_nOvrp-BBlqaF-HPlzrAtF5-KxSxd8QRhXyly8aESHugYHYflcQoH2oD2SDlEdB5MdzLa52MzdocrFPCAu8x2WvIsYzsQGv101eN2lOzqKegrd1Fq5fvR-hB1O58qfCKgUQXQreys2fjLJIzNkCeRhYACRykdxq80yT8gvDbQQMKxpRdWu6VihY7LL4ilNTkSKzOJjHBN1ibbhzeRbadYpHKpEHpzUz5iH2-w',
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
