import { API_ENDPOINTS, DEFAULTS } from '$lib/constants';
import type { AvailabilityParams } from '$lib/schemas';
import type { PaginationMeta, UnitMotor } from '$lib/types';
import api from './client';

export const unitMotorApi = {
	getAvailable: async (
		customFetch?: typeof fetch
	): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(API_ENDPOINTS.UNIT_MOTOR, {
			params: { limit: DEFAULTS.ALL_ITEMS_LIMIT },
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return { data: body.data, meta: body.meta };
	},
	getById: async (id: string, customFetch?: typeof fetch): Promise<UnitMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/${id}`, {
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return body.data;
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<UnitMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/slug/${slug}`, {
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return body.data;
	},
	checkAvailability: async (
		params: AvailabilityParams,
		customFetch?: typeof fetch
	): Promise<UnitMotor[]> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.UNIT_MOTOR}/availability`, {
			params,
			customFetch
		});
		return body.data;
	}
};
