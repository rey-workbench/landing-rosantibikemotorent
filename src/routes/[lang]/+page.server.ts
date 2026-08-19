import { jenisMotorService } from '$lib/services';
import { DEFAULTS } from '$lib/constants';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});
	const response = await jenisMotorService.getAll({ limit: DEFAULTS.FLEET_FEATURED_LIMIT }, fetch);
	return {
		featuredMotors: response.data
	};
};
