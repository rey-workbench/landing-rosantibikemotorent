import { blogApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const post = await blogApi.getBySlug(params.slug, fetch);
	return { post };
};
