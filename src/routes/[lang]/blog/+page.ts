import { blogApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [postsResponse, tags] = await Promise.all([
		blogApi.getAll({ page: 1, limit: 9 }, fetch),
		blogApi.getTags(fetch)
	]);

	return {
		initialPosts: postsResponse.data,
		initialMeta: postsResponse.meta,
		tags: tags || []
	};
};
