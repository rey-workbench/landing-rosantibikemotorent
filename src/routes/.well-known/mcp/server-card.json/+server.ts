import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const serverCard = {
		serverInfo: {
			name: 'rosantibike-mcp-server',
			version: '1.0.0',
			description: 'Model Context Protocol (MCP) server for RosantiBike motorcycle rentals and travel assistance in Malang.'
		},
		endpoint: 'https://rosantibikemotorent.com/mcp',
		transport: 'streamable-http',
		capabilities: {
			tools: {
				listChanged: true
			},
			resources: {
				subscribe: false,
				listChanged: false
			},
			prompts: {
				listChanged: false
			}
		},
		tools: [
			{
				name: 'get_motorcycle_catalog',
				description: 'Get live motorcycle rental catalog with rates, specifications, and availability in Malang.',
				inputSchema: {
					type: 'object',
					properties: {
						limit: { type: 'number', description: 'Number of items to return' },
						merk: { type: 'string', description: 'Brand filter (e.g. Honda, Yamaha)' }
					}
				}
			},
			{
				name: 'calculate_rental_price',
				description: 'Calculate total rental price based on start date, end date, and motorcycle model.',
				inputSchema: {
					type: 'object',
					properties: {
						motorId: { type: 'string' },
						days: { type: 'number' }
					},
					required: ['motorId', 'days']
				}
			}
		]
	};

	return new Response(JSON.stringify(serverCard, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
