import { unitMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
	const urlUnitId = url.searchParams.get('unitId');
	const urlUnitSlug = url.searchParams.get('unit');

	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const toISODate = (d: Date) => d.toISOString().split('T')[0];

	const startDate = toISODate(today);
	const endDate = toISODate(tomorrow);

	let availableMotors: any[] = [];
	try {
		const availabilityData = await unitMotorApi.checkAvailability(
			{
				startDate,
				endDate
			},
			fetch
		);
		// Filter units that are available for the entire range
		availableMotors = (availabilityData as any).units.filter((u: any) =>
			u.availability.every((a: any) => a.isAvailable)
		);
	} catch (e) {
		console.error('Failed to fetch availability:', e);
		// Fallback to all units if availability check fails
		const motorsResponse = await unitMotorApi.getAvailable(fetch);
		availableMotors = motorsResponse.data || [];
	}

	let selectedUnitFromUrl = null;
	if (urlUnitId) {
		selectedUnitFromUrl = availableMotors.find((m: any) => m.id === urlUnitId) || null;
		if (!selectedUnitFromUrl) {
			try {
				const unit = await unitMotorApi.getById(urlUnitId, fetch);
				if (unit) {
					selectedUnitFromUrl = unit;
					availableMotors = [selectedUnitFromUrl, ...availableMotors];
				}
			} catch (e) {
				console.error('Failed to fetch unit by ID:', e);
			}
		}
	} else if (urlUnitSlug) {	
		selectedUnitFromUrl =
			availableMotors.find(
				(m: any) => m.jenisMotor?.slug === urlUnitSlug || m.jenis?.slug === urlUnitSlug
			) || null;

		if (!selectedUnitFromUrl) {
			try {
				const jenis = await unitMotorApi.getBySlug(urlUnitSlug, fetch);
				if (jenis) {
					// If not found, it means it's fully booked. So we just leave it null.
				}
			} catch (e) {}
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
