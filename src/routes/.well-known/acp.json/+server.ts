import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const acpDiscovery = {
		protocol: {
			name: 'acp',
			version: '0.1.0'
		},
		merchant: {
			name: 'RosantiBike Motorent',
			description: 'Professional motorcycle rental and delivery service in Malang & Batu, East Java',
			url: 'https://rosantibikemotorent.com'
		},
		api_base_url: 'https://api.rosantibikemotorent.com/api',
		transports: ['http', 'https', 'rest'],
		capabilities: {
			services: [
				'catalog_discovery',
				'rental_booking',
				'live_rate_lookup',
				'delivery_service'
			],
			currencies_supported: ['IDR'],
			payment_methods_supported: ['qris', 'bank_transfer', 'cash_on_delivery']
		},
		endpoints: {
			catalog: 'https://api.rosantibikemotorent.com/api/jenis-motor',
			booking: 'https://api.rosantibikemotorent.com/api/transaksi',
			brands: 'https://api.rosantibikemotorent.com/api/unit-motor/brands',
			support_whatsapp: 'https://wa.me/628232152313'
		}
	};

	return new Response(JSON.stringify(acpDiscovery, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
