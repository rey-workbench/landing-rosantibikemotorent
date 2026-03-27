import { blogApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const post = await blogApi.getBySlug(params.slug);
	return { post };
};
