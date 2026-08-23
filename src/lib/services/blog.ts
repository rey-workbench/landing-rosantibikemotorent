import { blogApi } from '$lib/api';
import { type BlogFilter, BlogFilterSchema } from '$lib/schemas';
import type { BlogPost, BlogTag, PaginationMeta } from '$lib/types';
import { stripHtml } from '$lib/utils/format';

interface ProcessedBlogPost extends BlogPost {
	excerpt: string;
	formattedDate: string;
	readingTime: string;
}

function processPost(post: any): ProcessedBlogPost {
	const wordCount = post.konten ? post.konten.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
	const readingTime = Math.max(1, Math.ceil(wordCount / 200));
	return {
		...post,
		excerpt: stripHtml(post.konten),
		readingTime: `${readingTime} min read`
	};
}

export const blogService = {
	getAll: async (
		filter: BlogFilter = {},
		customFetch?: typeof fetch
	): Promise<{ data: ProcessedBlogPost[]; meta: PaginationMeta }> => {
		BlogFilterSchema.parse(filter);
		const response = await blogApi.getAll({ ...filter, status: 'TERBIT' }, customFetch);
		return {
			data: response.data.map(processPost),
			meta: response.meta
		};
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<ProcessedBlogPost> => {
		return processPost(await blogApi.getBySlug(slug, customFetch));
	},
	getTags: async (customFetch?: typeof fetch): Promise<BlogTag[]> => {
		return blogApi.getTags(customFetch);
	}
};
