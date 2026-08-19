import type { LayoutServerLoad } from './$types';
import { buildOrganizationSchema, type FleetMotor } from '$lib/seo/schema';
import { jenisMotorService } from '$lib/services';
import { DEFAULTS } from '$lib/constants';
import { getMotorImage } from '$lib/utils/image';

function motorCategory(merk: string, model: string, cc: number): string {
	const name = `${merk} ${model}`.toLowerCase();
	if (name.includes('pcx') || name.includes('nmax') || name.includes('aerox')) return 'Maxi Scooter';
	if (name.includes('scoopy')) return 'Retro Scooter';
	if (cc <= 115) return 'Standard Scooter';
	if (cc <= 150) return 'Medium Scooter';
	return 'Maxi Scooter';
}

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const fleet: FleetMotor[] = await jenisMotorService
		.getAll({ limit: DEFAULTS.FLEET_LIST_LIMIT }, fetch)
		.then((res) =>
			res.data
				.map((m) => {
					const image = getMotorImage(m);
					const price = Number(m.hargaSewa) || 0;
					if (!image || price <= 0) return null;
					return {
						name: `${m.merk} ${m.model}`,
						brand: m.merk,
						category: motorCategory(m.merk, m.model, m.cc),
						description: `Sewa ${m.merk} ${m.model} ${m.cc}cc di Malang.`,
						image,
						price: String(price)
					};
				})
				.filter((x): x is FleetMotor => x !== null)
		)
		.catch(() => []);

	return {
		locale: (locals as any).locale,
		organizationSchema: buildOrganizationSchema(fleet)
	};
};
