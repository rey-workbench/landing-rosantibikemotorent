import { blogService } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const post = await blogService.getBySlug(params.slug, fetch);
	return { post };
};
