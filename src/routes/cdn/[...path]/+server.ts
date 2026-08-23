import type { RequestHandler } from './$types';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dxuxgut2c/image/upload';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const remoteUrl = `${CLOUDINARY_BASE}/${params.path}`;
	const res = await fetch(remoteUrl);

	if (!res.ok) {
		return new Response(null, { status: res.status });
	}

	const headers = new Headers();
	headers.set('Content-Type', res.headers.get('content-type') || 'image/webp');
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');

	return new Response(res.body, { status: 200, headers });
};
