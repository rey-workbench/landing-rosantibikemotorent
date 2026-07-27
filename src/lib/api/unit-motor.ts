import api from './client';
import { API_ENDPOINTS } from '$lib/constants';
import type { UnitMotor, PaginationMeta } from '$lib/types';

export const unitMotorApi = {
	getAll: async (
		filter?: {
			page?: number;
			limit?: number;
			jenisId?: string;
			search?: string;
			ccMin?: number;
			ccMax?: number;
			brands?: string[];
		},
		customFetch?: typeof fetch
	): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(API_ENDPOINTS.UNIT_MOTOR, { params: filter, customFetch });
		return { data: body.data, meta: body.meta };
	},
	getAvailable: async (
		customFetch?: typeof fetch
	): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(API_ENDPOINTS.UNIT_MOTOR, {
			params: { limit: 100 },
			customFetch
		});
		return { data: body.data, meta: body.meta };
	},
	getById: async (id: string, customFetch?: typeof fetch): Promise<UnitMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/${id}`, { customFetch });
		return body.data;
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<UnitMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/slug/${slug}`, {
			customFetch
		});
		return body.data;
	},
	getBrands: async (customFetch?: typeof fetch): Promise<{ id: string; merk: string }[]> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/brands`, { customFetch });
		return body.data;
	},
	checkAvailability: async (
		params: {
			startDate: string;
			endDate: string;
			jenisId?: string;
		},
		customFetch?: typeof fetch
	): Promise<UnitMotor[]> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/availability`, {
			params,
			customFetch
		});
		return body.data;
	}
};
