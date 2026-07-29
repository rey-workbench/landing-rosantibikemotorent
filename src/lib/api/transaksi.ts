import api from './client';
import { API_ENDPOINTS } from '$lib/constants';
import type { Transaksi, PaginationMeta, PriceCalculation } from '$lib/types';
import { formatDate } from '$lib/utils/format';
import { z } from 'zod';

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

const CreateTransaksiSchema = z.object({
	namaPenyewa: z.string().min(2).max(100).regex(/^[\p{L}\s'-]+$/u, 'Invalid name'),
	noWhatsapp: z.string().regex(/^628\d{8,13}$/, 'Must be Indonesian WA number (628...)'),
	unitId: z.string().regex(/^\d{16,20}$/, 'Invalid ID').optional(),
	jenisId: z.string().regex(/^\d{16,20}$/, 'Invalid ID').optional(),
	tanggalMulai: z.string().date(),
	tanggalSelesai: z.string().date(),
	jamMulai: z.string().regex(/^\d{2}:\d{2}$/),
	jamSelesai: z.string().regex(/^\d{2}:\d{2}$/),
	jasHujan: z.number().int().min(0).max(10).optional(),
	helm: z.number().int().min(0).max(10).optional()
});

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
		CreateTransaksiSchema.parse(transaksi);
		const { data: body } = await api.post(API_ENDPOINTS.TRANSAKSI, transaksi);
		return {
			...processTransaksi(body.data),
			qrisBase64: body.data.qrisBase64
		};
	},
	getById: async (id: string): Promise<ProcessedTransaksi & { qrisBase64?: string }> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.TRANSAKSI}/${id}`);
		return {
			...processTransaksi(body.data),
			qrisBase64: body.data.qrisBase64
		};
	},
	searchByPhone: async (
		noWhatsapp: string
	): Promise<{ data: ProcessedTransaksi[]; meta: PaginationMeta }> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.TRANSAKSI}/search`, {
			params: { noHP: noWhatsapp }
		});
		return {
			data: (body.data || []).map(processTransaksi),
			meta: body.meta
		};
	},
	calculatePrice: async (params: CalculatePriceDto): Promise<PriceCalculation> => {
		const { data: body } = await api.post(`${API_ENDPOINTS.TRANSAKSI}/calculate-price`, params);
		return body.data;
	}
};
