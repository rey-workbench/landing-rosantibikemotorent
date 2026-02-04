import api from './axios';
import type { Transaksi, PaginationMeta, PriceCalculation } from '$lib/types';

export interface CreateTransaksiDto {
    namaPenyewa: string;
    noWhatsapp: string;
    unitId?: string;
    jenisId?: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jamMulai: string;
    jamSelesai: string;
    jasHujan?: number;
    helm?: number;
}

export interface CalculatePriceDto {
    unitId?: string;
    jenisId?: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    jamMulai: string;
    jamSelesai: string;
    jasHujan?: number;
    helm?: number;
}

export const transaksiApi = {
    create: async (transaksi: CreateTransaksiDto): Promise<Transaksi & { qrisBase64?: string }> => {
        const { data: body } = await api.post('/transaksi', transaksi);
        return body.data;
    },
    getById: async (id: string): Promise<Transaksi & { qrisBase64?: string }> => {
        const { data: body } = await api.get(`/transaksi/${id}`);
        return body.data;
    },
    searchByPhone: async (
        noWhatsapp: string
    ): Promise<{ data: Transaksi[]; meta: PaginationMeta }> => {
        const { data: body } = await api.get('/transaksi/search', {
            params: { noHP: noWhatsapp }
        });
        return { data: body.data, meta: body.meta };
    },
    calculatePrice: async (params: CalculatePriceDto): Promise<PriceCalculation> => {
        const { data: body } = await api.post('/transaksi/calculate-price', params);
        return body.data;
    }
};
