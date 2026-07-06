import { jenisMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [jenisResponse, brandsResponse] = await Promise.all([
		jenisMotorApi.getAll({ limit: 100 }, fetch),
		jenisMotorApi.getBrands(fetch)
	]);

	return {
		jenisMotors: jenisResponse.data,
		brands: brandsResponse || []
	};
};
