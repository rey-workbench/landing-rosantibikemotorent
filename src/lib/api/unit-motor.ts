import api from './axios';
import type { UnitMotor, PaginationMeta } from '$lib/types';

export const unitMotorApi = {
	getAll: async (filter?: {
		page?: number;
		limit?: number;
		status?: string;
		jenisId?: string;
		search?: string;
		ccMin?: number;
		ccMax?: number;
		brands?: string[];
	}): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get('/unit-motor', { params: filter });
		return { data: body.data, meta: body.meta };
	},
	getAvailable: async (): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get('/unit-motor', {
			params: { status: 'TERSEDIA', limit: 100 }
		});
		return { data: body.data, meta: body.meta };
	},
	getById: async (id: string): Promise<UnitMotor> => {
		const { data: body } = await api.get(`/unit-motor/${id}`);
		return body.data;
	},
	getBySlug: async (slug: string): Promise<UnitMotor> => {
		const { data: body } = await api.get(`/unit-motor/slug/${slug}`);
		return body.data;
	},
	getBrands: async (): Promise<{ id: string; merk: string }[]> => {
		const { data: body } = await api.get('/unit-motor/brands');
		return body.data;
	},
	checkAvailability: async (params: {
		startDate: string;
		endDate: string;
		jenisId?: string;
	}): Promise<UnitMotor[]> => {
		const { data: body } = await api.get('/unit-motor/availability', { params });
		return body.data;
	}
};
