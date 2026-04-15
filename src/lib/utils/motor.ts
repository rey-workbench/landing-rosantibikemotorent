import type { JenisMotor, UnitMotor } from '$lib/types';

export interface ProcessedJenisMotor extends JenisMotor {
	computed: {
		minPrice: number;
		hasAvailable: boolean;
		availableCount: number;
	};
}

export function processJenisMotor(jenis: any): ProcessedJenisMotor {
	const units = (jenis.unitMotor || []) as UnitMotor[];
	const hasAvailable = units.length > 0;
	const availableCount = units.length;

	let minPrice = 0;
	if (units.length > 0) {
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
