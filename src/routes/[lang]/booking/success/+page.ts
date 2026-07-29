import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const id = url.searchParams.get('id');
	
	// Basic guard: if id exists, it must be a valid Snowflake ID (16-20 digits).
	// This prevents basic injection and sequential enumeration.
	if (id && !/^\d{16,20}$/.test(id)) {
		throw error(404, 'Not found');
	}
	
	return {};
};
