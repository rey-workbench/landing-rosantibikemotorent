import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const x402Response = {
		error: 'Payment Required',
		message: 'Access to this API resource requires an x402 micropayment or booking token.',
		x402: {
			version: '1.0',
			scheme: 'x402',
			network: 'base',
			currency: 'USDC',
			amount: '1000',
			recipient: '0x0000000000000000000000000000000000000000',
			facilitator: 'https://rosantibikemotorent.com/api/x402',
			endpoints: {
				catalog: 'https://api.rosantibikemotorent.com/api/jenis-motor',
				booking: 'https://api.rosantibikemotorent.com/api/transaksi'
			}
		}
	};

	return new Response(JSON.stringify(x402Response, null, 2), {
		status: 402,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'X-402-Version': '1.0',
			'WWW-Authenticate':
				'X402 network="base", currency="USDC", amount="1000", recipient="0x0000000000000000000000000000000000000000"'
		}
	});
};
