import api from './client';
import { API_ENDPOINTS } from '$lib/constants';
import type { CreateTransaksiDto, CalculatePriceDto } from '$lib/schemas';
import type { Transaksi, PriceCalculation } from '$lib/types';

interface TransaksiWithQris extends Transaksi {
	qrisBase64?: string;
}

export const transaksiApi = {
	create: async (payload: CreateTransaksiDto): Promise<TransaksiWithQris> => {
		const { data: body } = await api.post(API_ENDPOINTS.TRANSAKSI, payload);
		return body.data;
	},
	getById: async (id: string): Promise<TransaksiWithQris> => {
		const { data: body } = await api.get(`${API_ENDPOINTS.TRANSAKSI}/${id}`);
		return body.data;
	},
	calculatePrice: async (params: CalculatePriceDto): Promise<PriceCalculation> => {
		const { data: body } = await api.post(`${API_ENDPOINTS.TRANSAKSI}/calculate-price`, params);
		return body.data;
	}
};
