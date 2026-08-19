import api from './client';
import { API_ENDPOINTS, DEFAULTS } from '$lib/constants';
import type { BlogFilter } from '$lib/schemas';
import type { BlogPost, BlogTag, PaginationMeta } from '$lib/types';

export const blogApi = {
	getAll: async (
		filter: BlogFilter = {},
		customFetch?: typeof fetch
	): Promise<{ data: BlogPost[]; meta: PaginationMeta }> => {
		const { data } = await api.get(API_ENDPOINTS.BLOG, {
			params: filter,
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return {
			data: (data.data || []) as BlogPost[],
			meta: data.meta as PaginationMeta
		};
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<BlogPost> => {
		const { data } = await api.get(`${API_ENDPOINTS.BLOG}/by-slug/${slug}`, {
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return data.data || data;
	},
	getTags: async (customFetch?: typeof fetch): Promise<BlogTag[]> => {
		const { data } = await api.get(`${API_ENDPOINTS.BLOG}/tags`, {
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return data.data;
	}
};
