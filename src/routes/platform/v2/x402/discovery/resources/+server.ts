import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const x402Discovery = {
		resources: [
			{
				resource: 'https://rosantibikemotorent.com/api',
				type: 'http',
				payment: {
					scheme: 'x402',
					version: '1.0',
					network: 'base',
					currency: 'USDC',
					amount: '1000',
					recipient: '0x0000000000000000000000000000000000000000',
					facilitator: 'https://rosantibikemotorent.com/api/x402'
				}
			},
			{
				resource: 'https://api.rosantibikemotorent.com/api/transaksi',
				type: 'http',
				payment: {
					scheme: 'x402',
					version: '1.0',
					network: 'base',
					currency: 'USDC',
					amount: '5000',
					recipient: '0x0000000000000000000000000000000000000000',
					facilitator: 'https://rosantibikemotorent.com/api/x402'
				}
			}
		]
	};

	return new Response(JSON.stringify(x402Discovery, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
