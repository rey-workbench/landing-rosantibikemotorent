import { error } from '@sveltejs/kit';
import { blogService } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const post = await blogService.getBySlug(params.slug, fetch);
		if (!post) {
			error(404, 'Artikel tidak ditemukan');
		}
		return { post };
	} catch (err: any) {
		if (err?.status === 404 || err?.response?.status === 404) {
			error(404, 'Artikel tidak ditemukan');
		}
		throw err;
	}
};
