import type { LayoutServerLoad } from './$types';
import { buildOrganizationSchema } from '$lib/seo/schema';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		locale: (locals as any).locale,
		organizationSchema: buildOrganizationSchema()
	};
};
