import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const width = parseInt(url.searchParams.get('width') || '800', 10);
	const height = parseInt(url.searchParams.get('height') || '450', 10);

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f5f5f7"/>
  <g fill="none" stroke="#d2d2d7" stroke-width="2" transform="translate(${width / 2 - 24}, ${height / 2 - 24})">
    <rect x="3" y="3" width="42" height="42" rx="6"/>
    <circle cx="16" cy="16" r="3"/>
    <path d="M42 32l-10-10L12 42"/>
  </g>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
