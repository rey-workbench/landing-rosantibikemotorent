import api from './axios';
import type { BlogPost, BlogTag, PaginationMeta } from '$lib/types';
import { formatDate, stripHtml } from '$lib/utils/format';

export interface ProcessedBlogPost extends BlogPost {
	excerpt: string;
	formattedDate: string;
}

function processPost(post: any): ProcessedBlogPost {
	return {
		...post,
		excerpt: stripHtml(post.konten),
		formattedDate: formatDate(post.createdAt)
	};
}

export const blogApi = {
	getAll: async (filter?: {
		page?: number;
		limit?: number;
		status?: string;
		search?: string;
		tagId?: string;
	}): Promise<{ data: ProcessedBlogPost[]; meta: PaginationMeta }> => {
		const params = { ...filter, status: 'TERBIT' };
		const { data } = await api.get('/blog', { params });
		return {
			data: (data.data || []).map(processPost),
			meta: data.meta
		};
	},
	getById: async (id: string): Promise<ProcessedBlogPost> => {
		const { data } = await api.get(`/blog/${id}`);
		const post = data.data || data;
		return processPost(post);
	},
	getBySlug: async (slug: string): Promise<ProcessedBlogPost> => {
		const { data } = await api.get(`/blog/by-slug/${slug}`);
		const post = data.data || data;
		return processPost(post);
	},
	getTags: async (): Promise<BlogTag[]> => {
		const { data } = await api.get('/blog/tags');
		return data.data;
	}
};
