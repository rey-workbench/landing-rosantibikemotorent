import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const a2aCard = {
		name: 'RosantiBike Motorent Agent',
		version: '1.0.0',
		description:
			'Official A2A agent for motorcycle rentals, rates, and automated travel reservations in Malang & Batu.',
		url: 'https://rosantibikemotorent.com',
		provider: {
			name: 'RosantiBike Motorent',
			url: 'https://rosantibikemotorent.com'
		},
		supportedInterfaces: [
			{
				url: 'https://api.rosantibikemotorent.com/api',
				protocol: 'REST',
				transport: 'HTTPS'
			},
			{
				url: 'https://rosantibikemotorent.com/.well-known/mcp/server-card.json',
				protocol: 'MCP',
				transport: 'StreamableHTTP'
			}
		],
		capabilities: {
			streaming: true,
			tools: true,
			commerce: true,
			extensions: [
				{
					uri: 'https://github.com/google-agentic-commerce/AP2/tree/v0.1.0',
					required: true,
					params: {
						roles: ['merchant']
					}
				},
				{
					uri: 'https://ap2-protocol.org/',
					required: true,
					params: {
						roles: ['merchant']
					}
				}
			]
		},
		extensions: [
			{
				uri: 'https://github.com/google-agentic-commerce/AP2/tree/v0.1.0',
				required: true,
				roles: ['merchant'],
				params: {
					roles: ['merchant']
				}
			},
			{
				uri: 'https://ap2-protocol.org/',
				required: true,
				roles: ['merchant'],
				params: {
					roles: ['merchant']
				}
			}
		],
		skills: [
			{
				id: 'motorcycle-catalog',
				name: 'Motorcycle Catalog Lookup',
				description:
					'Find available motorbikes, engine displacement (CC), transmission type, and daily rental prices in Malang.'
			},
			{
				id: 'rate-calculator',
				name: 'Rental Price Calculator',
				description:
					'Calculate rental pricing for single-day, multi-day, and monthly rentals including helmet and delivery.'
			},
			{
				id: 'reservation-booking',
				name: 'Create Motorcycle Booking',
				description:
					'Reserve a motorcycle with delivery to hotels, Malang Train Station (Kotabaru), or Terminal Arjosari.'
			}
		]
	};

	return new Response(JSON.stringify(a2aCard, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
