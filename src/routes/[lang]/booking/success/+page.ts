import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { transaksiApi } from '$lib/api';

export const load: PageLoad = async ({ url }) => {
	const id = url.searchParams.get('id');
	
	// Basic guard: if id exists, it must be a valid Snowflake ID (16-20 digits).
	// This prevents basic injection and sequential enumeration.
	if (id && !/^\d{16,20}$/.test(id)) {
		throw error(404, 'Not found');
	}
	
	let transaksi = null;
	if (id) {
		try {
			transaksi = await transaksiApi.getById(id);
		} catch (err) {
			console.error('Failed to load transaction:', err);
		}
	}
	
	return {
		transaksi
	};
};
