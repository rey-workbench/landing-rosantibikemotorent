import { transaksiApi } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
        throw error(400, 'ID booking tidak ditemukan');
    }

    try {
        const transaksi = await transaksiApi.getById(id);
        return { transaksi };
    } catch (err) {
        throw error(404, err instanceof Error ? err.message : 'Gagal memuat data booking');
    }
};
