import { jenisMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const response = await jenisMotorApi.getAll({ limit: 4 });
    return {
        featuredMotors: response.data
    };
};
