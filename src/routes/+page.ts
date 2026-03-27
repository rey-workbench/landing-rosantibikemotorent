import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	// Simple redirect from "/" to "/id"
	// (You can add more detection logic here if you want)
	if (url.pathname === '/') {
		throw redirect(308, '/id');
	}
};
