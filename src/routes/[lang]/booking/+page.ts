import { unitMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const urlUnitId = url.searchParams.get('unitId');

	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const toISODate = (d: Date) => d.toISOString().split('T')[0];

	const startDate = toISODate(today);
	const endDate = toISODate(tomorrow);

	let availableMotors: any[] = [];
	try {
		const availabilityData = await unitMotorApi.checkAvailability({
			startDate,
			endDate
		});
		// Filter units that are available for the entire range
		availableMotors = (availabilityData as any).units
			.filter((u: any) => u.availability.every((a: any) => a.isAvailable))
			.map((u: any) => ({
				...u,
				id: u.unitId,
				jenis: u.jenisMotor // Map to expected frontend property
			}));
	} catch (e) {
		console.error('Failed to fetch availability:', e);
		// Fallback to all units if availability check fails, to avoid total breakage
		const motorsResponse = await unitMotorApi.getAvailable();
		availableMotors = motorsResponse.data || [];
	}

	let selectedUnitFromUrl = null;
	if (urlUnitId) {
		selectedUnitFromUrl = availableMotors.find((m: any) => m.id === urlUnitId) || null;
		if (!selectedUnitFromUrl) {
			try {
				const unit = await unitMotorApi.getById(urlUnitId);
				if (unit) {
					selectedUnitFromUrl = unit;
					availableMotors = [unit, ...availableMotors];
				}
			} catch (e) {
				console.error('Failed to fetch unit from URL:', e);
			}
		}
	}

	return {
		availableMotors,
		selectedUnitFromUrl,
		defaultDates: {
			mulai: startDate,
			selesai: endDate
		}
	};
};
