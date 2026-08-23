import { unitMotorApi } from '$lib/api';
import { type AvailabilityParams, AvailabilityParamsSchema } from '$lib/schemas';
import type { PaginationMeta, UnitMotor } from '$lib/types';

export const unitMotorService = {
	getAvailable: async (
		customFetch?: typeof fetch
	): Promise<{ data: UnitMotor[]; meta: PaginationMeta }> => {
		return unitMotorApi.getAvailable(customFetch);
	},
	getById: async (id: string, customFetch?: typeof fetch): Promise<UnitMotor> => {
		return unitMotorApi.getById(id, customFetch);
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<UnitMotor> => {
		return unitMotorApi.getBySlug(slug, customFetch);
	},
	checkAvailability: async (
		params: AvailabilityParams,
		customFetch?: typeof fetch
	): Promise<UnitMotor[]> => {
		AvailabilityParamsSchema.parse(params);
		return unitMotorApi.checkAvailability(params, customFetch);
	}
};
