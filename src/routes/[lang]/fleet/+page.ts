import { jenisMotorService } from '$lib/services';
import { DEFAULTS } from '$lib/constants';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await jenisMotorService.getAll({ limit: DEFAULTS.FLEET_LIST_LIMIT }, fetch);

	return {
		jenisMotors: response.data
	};
};
