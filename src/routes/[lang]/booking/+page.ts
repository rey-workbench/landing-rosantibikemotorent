import { unitMotorApi } from '$lib/api';
import type { PageLoad } from './$types';

async function resolveById(
	availableMotors: any[],
	urlUnitId: string,
	fetch: typeof window.fetch
): Promise<{ selectedUnit: any; updatedMotors: any[] }> {
	let selectedUnit = availableMotors.find((m: any) => m.id === urlUnitId) || null;
	let updatedMotors = [...availableMotors];
	if (!selectedUnit) {
		try {
			const unit = await unitMotorApi.getById(urlUnitId, fetch);
			if (unit) {
				selectedUnit = unit;
				updatedMotors = [selectedUnit, ...updatedMotors];
			}
		} catch (e) {
			console.error('Failed to fetch unit by ID:', e);
		}
	}
	return { selectedUnit, updatedMotors };
}

async function resolveBySlug(
	availableMotors: any[],
	urlUnitSlug: string,
	fetch: typeof window.fetch
): Promise<any> {
	let selectedUnit =
		availableMotors.find(
			(m: any) => m.jenisMotor?.slug === urlUnitSlug || m.jenis?.slug === urlUnitSlug
		) || null;

	if (!selectedUnit) {
		try {
			const jenis = await unitMotorApi.getBySlug(urlUnitSlug, fetch);
			if (jenis) {
				console.log(`Model ${urlUnitSlug} is fully booked.`);
			}
		} catch (e) {
			console.error('Failed to fetch motor by slug:', e);
		}
	}
	return selectedUnit;
}

async function resolveSelectedUnit(
	availableMotors: any[],
	urlUnitId: string | null,
	urlUnitSlug: string | null,
	fetch: typeof window.fetch
): Promise<{ selectedUnit: any; updatedMotors: any[] }> {
	if (urlUnitId) {
		return resolveById(availableMotors, urlUnitId, fetch);
	}
	if (urlUnitSlug) {
		const selectedUnit = await resolveBySlug(availableMotors, urlUnitSlug, fetch);
		return { selectedUnit, updatedMotors: availableMotors };
	}
	return { selectedUnit: null, updatedMotors: availableMotors };
}

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
		availableMotors = (availabilityData as any).units.filter((u: any) =>
			u.availability.every((a: any) => a.isAvailable)
		);
	} catch (e) {
		console.error('Failed to fetch availability:', e);
		const motorsResponse = await unitMotorApi.getAvailable(fetch);
		availableMotors = motorsResponse.data || [];
	}

	const { selectedUnit, updatedMotors } = await resolveSelectedUnit(
		availableMotors,
		urlUnitId,
		urlUnitSlug,
		fetch
	);

	return {
		availableMotors: updatedMotors,
		selectedUnitFromUrl: selectedUnit,
		defaultDates: {
			mulai: startDate,
			selesai: endDate
		}
	};
};
