import api from './axios';
import { API_ENDPOINTS } from '$lib/constants';
import type { JenisMotor, UnitMotor, PaginationMeta } from '$lib/types';

export interface ProcessedJenisMotor extends JenisMotor {
	computed: {
		minPrice: number;
		hasAvailable: boolean;
		availableCount: number;
	};
}

function processJenis(jenis: any): ProcessedJenisMotor {
	const availableUnits = (jenis.unitMotor || []) as UnitMotor[];
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

export const jenisMotorApi = {
	getAll: async (filter?: {
		page?: number;
		limit?: number;
		search?: string;
		merk?: string;
	}): Promise<{ data: ProcessedJenisMotor[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(API_ENDPOINTS.JENIS_MOTOR, { params: filter });
		return {
			data: (body.data || []).map(processJenis),
			meta: body.meta
		};
	},
	getById: async (id: string): Promise<ProcessedJenisMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.JENIS_MOTOR}/${id}`);
		return processJenis(body.data);
	},
	getBySlug: async (slug: string): Promise<ProcessedJenisMotor> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.JENIS_MOTOR}/slug/${slug}`);
		return processJenis(body.data);
	},
	getBrands: async (): Promise<{ id: string; merk: string }[]> => {
		const { data: body } = await api.get(API_ENDPOINTS.JENIS_MOTOR, { params: { limit: 1000 } });
		const brands = new Map<string, string>();
		for (const jenis of body.data || []) {
			if (jenis.merk && !brands.has(jenis.merk)) {
				brands.set(jenis.merk, jenis.id);
			}
		}
		return Array.from(brands.entries()).map(([merk, id]) => ({ id, merk }));
	}
};
