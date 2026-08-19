import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const x402Config = {
		version: '1.0.0',
		facilitator: 'https://rosantibikemotorent.com/api/x402',
		merchant: {
			name: 'RosantiBike Motorent',
			description: 'Instant AI Agent rental payments and booking facilitator'
		},
		supported_networks: ['polygon', 'base', 'ethereum', 'solana'],
		supported_tokens: ['USDC', 'USDT', 'IDR'],
		endpoints: {
			quote: 'https://api.rosantibikemotorent.com/api/jenis-motor',
			pay: 'https://api.rosantibikemotorent.com/api/transaksi'
		}
	};

	return new Response(JSON.stringify(x402Config, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
