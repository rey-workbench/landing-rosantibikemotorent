import { transaksiApi } from '$lib/api';
import {
	CreateTransaksiSchema,
	CalculatePriceSchema,
	type CreateTransaksiDto,
	type CalculatePriceDto
} from '$lib/schemas';
import type { Transaksi, PriceCalculation } from '$lib/types';
import { formatDate } from '$lib/utils/format';

interface ProcessedTransaksi extends Transaksi {
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

export const transaksiService = {
	create: async (
		payload: CreateTransaksiDto
	): Promise<ProcessedTransaksi & { qrisBase64?: string }> => {
		CreateTransaksiSchema.parse(payload);
		const result = await transaksiApi.create(payload);
		return {
			...processTransaksi(result),
			qrisBase64: result.qrisBase64
		};
	},
	getById: async (id: string): Promise<ProcessedTransaksi & { qrisBase64?: string }> => {
		const result = await transaksiApi.getById(id);
		return {
			...processTransaksi(result),
			qrisBase64: result.qrisBase64
		};
	},
	calculatePrice: async (params: CalculatePriceDto): Promise<PriceCalculation> => {
		CalculatePriceSchema.parse(params);
		return transaksiApi.calculatePrice(params);
	}
};
