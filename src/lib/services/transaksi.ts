import { transaksiApi } from '$lib/api';
import {
	type CalculatePriceDto,
	CalculatePriceSchema,
	type CreateTransaksiDto,
	CreateTransaksiSchema
} from '$lib/schemas';
import type { PriceCalculation, Transaksi } from '$lib/types';

interface ProcessedTransaksi extends Transaksi {}

function processTransaksi(t: any): ProcessedTransaksi {
	return {
		...t
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
