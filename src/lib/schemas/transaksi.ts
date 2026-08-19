import { z } from 'zod';

const rentalWindowSchema = z.object({
	unitId: z
		.string()
		.regex(/^\d{16,20}$/, 'Invalid ID')
		.optional(),
	jenisId: z
		.string()
		.regex(/^\d{16,20}$/, 'Invalid ID')
		.optional(),
	tanggalMulai: z.string().date(),
	tanggalSelesai: z.string().date(),
	jamMulai: z.string().regex(/^\d{2}:\d{2}$/),
	jamSelesai: z.string().regex(/^\d{2}:\d{2}$/),
	jasHujan: z.number().int().min(0).max(10).optional(),
	helm: z.number().int().min(0).max(10).optional()
});

export const CreateTransaksiSchema = rentalWindowSchema.extend({
	namaPenyewa: z
		.string()
		.min(2)
		.max(100)
		.regex(/^[\p{L}\s'-]+$/u, 'Invalid name'),
	noWhatsapp: z.string().regex(/^628\d{8,13}$/, 'Must be Indonesian WA number (628...)')
});

export type CreateTransaksiDto = z.infer<typeof CreateTransaksiSchema>;

export const CalculatePriceSchema = rentalWindowSchema;

export type CalculatePriceDto = z.infer<typeof CalculatePriceSchema>;
