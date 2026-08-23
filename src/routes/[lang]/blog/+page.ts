import { DEFAULTS } from '$lib/constants';
import { blogService } from '$lib/services';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [postsResponse, tags] = await Promise.all([
		blogService.getAll({ page: 1, limit: DEFAULTS.BLOG_PAGE_SIZE }, fetch),
		blogService.getTags(fetch)
	]);

	return {
		initialPosts: postsResponse.data,
		initialMeta: postsResponse.meta,
		tags: tags || []
	};
};
