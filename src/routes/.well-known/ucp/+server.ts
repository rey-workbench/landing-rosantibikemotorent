import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const ucpDiscovery = {
		ucp: {
			version: '1.0.0',
			services: [
				'motorcycle_rental',
				'scooter_rental',
				'vehicle_delivery',
				'tourist_transportation'
			],
			capabilities: [
				'catalog_browsing',
				'price_quotation',
				'reservation_intent',
				'instant_confirmation'
			],
			endpoints: {
				catalog: 'https://api.rosantibikemotorent.com/api/jenis-motor',
				quote: 'https://api.rosantibikemotorent.com/api/jenis-motor',
				booking: 'https://api.rosantibikemotorent.com/api/transaksi'
			}
		},
		protocol_version: '1.0.0',
		merchant: {
			name: 'RosantiBike Motorent',
			id: 'rosantibike-malang',
			url: 'https://rosantibikemotorent.com'
		},
		services: ['motorcycle_rental', 'scooter_rental', 'vehicle_delivery', 'tourist_transportation'],
		capabilities: [
			'catalog_browsing',
			'price_quotation',
			'reservation_intent',
			'instant_confirmation'
		],
		endpoints: {
			catalog: 'https://api.rosantibikemotorent.com/api/jenis-motor',
			quote: 'https://api.rosantibikemotorent.com/api/jenis-motor',
			booking: 'https://api.rosantibikemotorent.com/api/transaksi',
			documentation: 'https://rosantibikemotorent.com/llms.txt',
			terms: 'https://rosantibikemotorent.com/id/terms'
		},
		schema_url: 'https://ucp.dev/schemas/v1/commerce.json'
	};

	return new Response(JSON.stringify(ucpDiscovery, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
