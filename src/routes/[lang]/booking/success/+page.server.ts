import { error } from '@sveltejs/kit';
import { transaksiService } from '$lib/services';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const id = cookies.get('booking_session');

	if (id && !/^\d{16,20}$/.test(id)) {
		cookies.delete('booking_session', { path: '/' });
		throw error(404, 'Not found');
	}

	let transaksi = null;
	if (id) {
		try {
			transaksi = await transaksiService.getById(id);
		} catch {
			// Silent fail, handled below
		}
	}

	if (!transaksi) {
		cookies.delete('booking_session', { path: '/' });
		throw error(404, 'Transaksi tidak ditemukan');
	}

	return {
		transaksi
	};
};
