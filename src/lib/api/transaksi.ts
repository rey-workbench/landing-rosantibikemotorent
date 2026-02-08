import api from './axios';
import type { Transaksi, PaginationMeta, PriceCalculation } from '$lib/types';
import { formatDate } from '$lib/utils/format';

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

export interface ProcessedTransaksi extends Transaksi {
    formatted: {
        mulai: string;
        selesai: string;
    };
}

function processTransaksi(t: any): ProcessedTransaksi {
    return {
        ...t,
        formatted: {
            mulai: `${formatDate(t.tanggalMulai, 'full')} • ${t.jamMulai}`,
            selesai: `${formatDate(t.tanggalSelesai, 'full')} • ${t.jamSelesai}`
        }
    };
}

export const transaksiApi = {
    create: async (
        transaksi: CreateTransaksiDto
    ): Promise<ProcessedTransaksi & { qrisBase64?: string }> => {
        const { data: body } = await api.post('/transaksi', transaksi);
        return {
            ...processTransaksi(body.data),
            qrisBase64: body.data.qrisBase64
        };
    },
    getById: async (id: string): Promise<ProcessedTransaksi & { qrisBase64?: string }> => {
        const { data: body } = await api.get(`/transaksi/${id}`);
        return {
            ...processTransaksi(body.data),
            qrisBase64: body.data.qrisBase64
        };
    },
    searchByPhone: async (
        noWhatsapp: string
    ): Promise<{ data: ProcessedTransaksi[]; meta: PaginationMeta }> => {
        const { data: body } = await api.get('/transaksi/search', {
            params: { noHP: noWhatsapp }
        });
        return {
            data: (body.data || []).map(processTransaksi),
            meta: body.meta
        };
    },
    calculatePrice: async (params: CalculatePriceDto): Promise<PriceCalculation> => {
        const { data: body } = await api.post('/transaksi/calculate-price', params);
        return body.data;
    }
};
