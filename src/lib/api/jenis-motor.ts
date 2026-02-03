import api from './axios';
import type { JenisMotor, PaginationMeta } from '$lib/types';

export const jenisMotorApi = {
    getAll: async (filter?: {
        page?: number;
        limit?: number;
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
    }
};
