import { jenisMotorApi } from '$lib/api';
import { JenisMotorFilterSchema, type JenisMotorFilter } from '$lib/schemas';
import { DEFAULTS } from '$lib/constants';
import type { JenisMotor, PaginationMeta } from '$lib/types';

interface ProcessedJenisMotor extends JenisMotor {
	computed: {
		minPrice: number;
		hasAvailable: boolean;
		availableCount: number;
	};
}

function processJenis(jenis: any): ProcessedJenisMotor {
	const availableUnits = (jenis.unitMotor || []) as any[];
	const hasAvailable = availableUnits.length > 0;
	const availableCount = availableUnits.length;

	let minPrice = 0;
	if (availableUnits.length > 0) {
		minPrice = Number(jenis.hargaSewa || 0);
	}

	return {
		...jenis,
		computed: {
			minPrice,
			hasAvailable,
			availableCount
		}
	};
}

export const jenisMotorService = {
	getAll: async (
		filter: JenisMotorFilter = {},
		customFetch?: typeof fetch
	): Promise<{ data: ProcessedJenisMotor[]; meta: PaginationMeta }> => {
		JenisMotorFilterSchema.parse(filter);
		const response = await jenisMotorApi.getAll(filter, customFetch);
		return {
			data: response.data.map(processJenis),
			meta: response.meta
		};
	},
	getBySlug: async (slug: string, customFetch?: typeof fetch): Promise<ProcessedJenisMotor> => {
		return processJenis(await jenisMotorApi.getBySlug(slug, customFetch));
	},
	getBrands: async (customFetch?: typeof fetch): Promise<{ id: string; merk: string }[]> => {
		const { data } = await jenisMotorApi.getAll(
			{ limit: DEFAULTS.FLEET_BRANDS_LIMIT },
			customFetch
		);
		const brands = new Map<string, string>();
		for (const jenis of data) {
			if (jenis.merk && !brands.has(jenis.merk)) {
				brands.set(jenis.merk, jenis.id);
			}
		}
		return Array.from(brands.entries()).map(([merk, id]) => ({ id, merk }));
	}
};
