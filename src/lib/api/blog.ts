import api from './axios';
import type { BlogPost, BlogTag, PaginationMeta } from '$lib/types';

export const blogApi = {
    getAll: async (filter?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
        tagId?: string;
    }): Promise<{ data: BlogPost[]; meta: PaginationMeta }> => {
        // Force status to TERBIT for customer frontend
        const params = { ...filter, status: 'TERBIT' };
        const { data } = await api.get('/blog', { params });
        return { data: data.data, meta: data.meta };
    },
    getById: async (id: string): Promise<BlogPost> => {
        const { data } = await api.get(`/blog/${id}`);
        return data.data || data;
    },
    getBySlug: async (slug: string): Promise<BlogPost> => {
        const { data } = await api.get(`/blog/by-slug/${slug}`);
        return data.data || data;
    },
    getTags: async (): Promise<BlogTag[]> => {
        const { data } = await api.get('/blog/tags');
        return data.data;
    }
};
