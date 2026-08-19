import { unitMotorService } from '$lib/services';
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
			const unit = await unitMotorService.getById(urlUnitId, fetch);
			if (unit) {
				selectedUnit = unit;
				updatedMotors = [selectedUnit, ...updatedMotors];
			}
		} catch (e) {
			if (import.meta.env.DEV) console.warn('Failed to fetch unit by ID:', e);
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
			const jenis = await unitMotorService.getBySlug(urlUnitSlug, fetch);
			if (jenis && import.meta.env.DEV) {
				console.log(`Model ${urlUnitSlug} is fully booked.`);
			}
		} catch (e) {
			if (import.meta.env.DEV) console.warn('Failed to fetch motor by slug:', e);
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

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDateParam(value: string | null, fallback: string): string {
	return value && ISO_DATE_RE.test(value) ? value : fallback;
}

export const load: PageLoad = async ({ url, fetch }) => {
	const urlUnitId = url.searchParams.get('unitId');
	const urlUnitSlug = url.searchParams.get('unit');

	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const toISODate = (d: Date) => d.toISOString().split('T')[0];

	const startDate = parseDateParam(url.searchParams.get('mulai'), toISODate(today));
	const endDate = parseDateParam(url.searchParams.get('selesai'), toISODate(tomorrow));

	let availableMotors: any[] = [];
	try {
		const availabilityData = await unitMotorService.checkAvailability(
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
		if (import.meta.env.DEV) console.warn('Failed to fetch availability:', e);
		const motorsResponse = await unitMotorService.getAvailable(fetch);
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
