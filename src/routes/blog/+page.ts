import { blogApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const [postsResponse, tags] = await Promise.all([
        blogApi.getAll({ page: 1, limit: 9 }),
        blogApi.getTags()
    ]);

    return {
        initialPosts: postsResponse.data,
        initialMeta: postsResponse.meta,
        tags: tags || []
    };
};
