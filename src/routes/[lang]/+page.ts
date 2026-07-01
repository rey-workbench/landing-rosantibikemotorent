import { jenisMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await jenisMotorApi.getAll({ limit: 4 }, fetch);
	return {
		featuredMotors: response.data
	};
};
