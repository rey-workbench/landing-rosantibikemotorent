import { jenisMotorApi } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { UnitMotor } from '$lib/types';

export const load: PageLoad = async ({ params }) => {
	try {
		const jenisData = (await jenisMotorApi.getBySlug(params.slug)) as any;

		if (!jenisData || !jenisData.unitMotor || jenisData.unitMotor.length === 0) {
			throw error(404, 'Tidak ada unit tersedia untuk model ini');
		}

		const units = jenisData.unitMotor as UnitMotor[];
		const availableUnit = units.find((u) => u.status === 'TERSEDIA') || units[0];

		return {
			motor: {
				...availableUnit,
				jenisMotor: jenisData
			}
		};
	} catch (err) {
		if ((err as any).status === 404) throw err;
		throw error(404, err instanceof Error ? err.message : 'Motor tidak ditemukan');
	}
};
