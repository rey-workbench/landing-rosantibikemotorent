import { z } from 'zod';

export const JenisMotorFilterSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).optional(),
	search: z.string().max(100).optional(),
	merk: z.string().max(50).optional()
});

export type JenisMotorFilter = z.infer<typeof JenisMotorFilterSchema>;

export const AvailabilityParamsSchema = z.object({
	startDate: z.string().date(),
	endDate: z.string().date(),
	jenisId: z
		.string()
		.regex(/^\d{16,20}$/, 'Invalid ID')
		.optional()
});

export type AvailabilityParams = z.infer<typeof AvailabilityParamsSchema>;
