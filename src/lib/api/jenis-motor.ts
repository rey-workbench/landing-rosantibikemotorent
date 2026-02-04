import api from './axios';
import type { JenisMotor, PaginationMeta } from '$lib/types';

export const jenisMotorApi = {
    getAll: async (filter?: {
        page?: number;
        limit?: number;
        search?: string;
        merk?: string;
    }): Promise<{ data: JenisMotor[]; meta: PaginationMeta }> => {
        const { data: body } = await api.get('/jenis-motor', { params: filter });
        return { data: body.data, meta: body.meta };
    },
    getById: async (id: string): Promise<JenisMotor> => {
        const { data: body } = await api.get(`/jenis-motor/${id}`);
        return body.data;
    },
    getBySlug: async (slug: string): Promise<JenisMotor> => {
        const { data: body } = await api.get(`/jenis-motor/slug/${slug}`);
        return body.data;
    },
    getBrands: async (): Promise<{ id: string; merk: string }[]> => {
        // Get all jenis motor and extract unique brands
        const { data: body } = await api.get('/jenis-motor', { params: { limit: 1000 } });
        const brands = new Map<string, string>();
        for (const jenis of body.data) {
            if (!brands.has(jenis.merk)) {
                brands.set(jenis.merk, jenis.id);
            }
        }
        return Array.from(brands.entries()).map(([merk, id]) => ({ id, merk }));
    }
};
