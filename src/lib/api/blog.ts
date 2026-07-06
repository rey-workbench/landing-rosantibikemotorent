import api from './client';
import { API_ENDPOINTS } from '$lib/constants';
import type { BlogPost, BlogTag, PaginationMeta } from '$lib/types';
import { formatDate, stripHtml } from '$lib/utils/format';

export interface ProcessedBlogPost extends BlogPost {
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
		formattedDate: formatDate(post.createdAt),
		readingTime: `${readingTime} min read`
	};
}

export const blogApi = {
	getAll: async (
		filter?: {
			page?: number;
			limit?: number;
			status?: string;
			search?: string;
			tagId?: string;
		},
		customFetch?: typeof fetch
	): Promise<{ data: ProcessedBlogPost[]; meta: PaginationMeta }> => {
		const params = { ...filter, status: 'TERBIT' };
		const { data } = await api.get(API_ENDPOINTS.BLOG, { params, customFetch });
		return {
			data: (data.data || []).map(processPost),
			meta: data.meta
		};
	},
	getById: async (id: string, customFetch?: typeof fetch): Promise<ProcessedBlogPost> => {
		const { data } = await api.get(`${API_ENDPOINTS.BLOG}/${id}`, { customFetch });
		const post = data.data || data;
		return processPost(post);
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<ProcessedBlogPost> => {
		const { data } = await api.get(`${API_ENDPOINTS.BLOG}/by-slug/${slug}`, { customFetch });
		const post = data.data || data;
		return processPost(post);
	},
	getTags: async (customFetch?: typeof fetch): Promise<BlogTag[]> => {
		const { data } = await api.get(`${API_ENDPOINTS.BLOG}/tags`, { customFetch });
		return data.data;
	}
};
