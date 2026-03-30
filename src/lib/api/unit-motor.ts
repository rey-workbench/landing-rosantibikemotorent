import api from './axios';
import { API_ENDPOINTS } from '$lib/constants';
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
		const { data: body } = await api.get(API_ENDPOINTS.UNIT_MOTOR, { params: filter });
		return { data: body.data, meta: body.meta };
	},
	getAvailable: async (): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(API_ENDPOINTS.UNIT_MOTOR, {
			params: { status: 'TERSEDIA', limit: 100 }
		});
		return { data: body.data, meta: body.meta };
	},
	getById: async (id: string): Promise<UnitMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/${id}`);
		return body.data;
	},
	getBySlug: async (slug: string): Promise<UnitMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/slug/${slug}`);
		return body.data;
	},
	getBrands: async (): Promise<{ id: string; merk: string }[]> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/brands`);
		return body.data;
	},
	checkAvailability: async (params: {
		startDate: string;
		endDate: string;
		jenisId?: string;
	}): Promise<UnitMotor[]> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/availability`, { params });
		return body.data;
	}
};
