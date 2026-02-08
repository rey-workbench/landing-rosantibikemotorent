import { jenisMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const [jenisResponse, brandsResponse] = await Promise.all([
        jenisMotorApi.getAll({ limit: 100 }),
        jenisMotorApi.getBrands()
    ]);

    return {
        jenisMotors: jenisResponse.data,
        brands: brandsResponse || []
    };
};
