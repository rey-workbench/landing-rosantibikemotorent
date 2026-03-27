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
	const availableUnits = units.filter((u: UnitMotor) => u.status === 'TERSEDIA');
	const hasAvailable = availableUnits.length > 0;
	const availableCount = availableUnits.length;

	let minPrice = 0;
	if (units.length > 0) {
		if (hasAvailable) {
			minPrice = Math.min(...availableUnits.map((u) => u.hargaSewa));
		} else {
			minPrice = Math.min(...units.map((u) => u.hargaSewa));
		}
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
