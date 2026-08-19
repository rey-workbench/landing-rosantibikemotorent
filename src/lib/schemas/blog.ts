import { z } from 'zod';

export const BlogFilterSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).optional(),
	status: z.string().max(20).optional(),
	search: z.string().max(100).optional(),
	tagId: z.string().max(50).optional()
});

export type BlogFilter = z.infer<typeof BlogFilterSchema>;
