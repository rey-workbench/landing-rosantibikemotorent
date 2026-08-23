import { API_ENDPOINTS, DEFAULTS } from '$lib/constants';
import type { JenisMotorFilter } from '$lib/schemas';
import type { JenisMotor, PaginationMeta } from '$lib/types';
import api from './client';

export const jenisMotorApi = {
	getAll: async (
		filter: JenisMotorFilter = {},
		customFetch?: typeof fetch
	): Promise<{ data: JenisMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(API_ENDPOINTS.JENIS_MOTOR, {
			params: filter,
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return {
			data: (body.data || []) as JenisMotor[],
			meta: body.meta as PaginationMeta
		};
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<JenisMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.JENIS_MOTOR}/slug/${slug}`, {
			customFetch
		});
		return body.data;
	}
};
