import { MAX_INT } from './common-schema';
import { z } from 'zod';

export const insertUserItemSchema = z
	.object({
		userId: z.coerce.number().int().min(1).max(MAX_INT),
		itemId: z.coerce.number().int().min(1).max(MAX_INT),
	})
	.pick({ userId: true, itemId: true });

export const updateUserItemSchema = z
	.object({
		userId: z.coerce.number().int().min(1).max(MAX_INT),
		upgrade: z.coerce.number().int().min(0).max(MAX_INT).optional(),
		quantity: z.coerce.number().int().min(0).max(MAX_INT).optional(),
	})
	.pick({ userId: true, upgrade: true, quantity: true })
	.refine((data) => data.upgrade !== undefined || data.quantity !== undefined, {
		message: 'Pelo menos um dos campos "upgrade" ou "quantity" deve ser informado.',
		path: ['upgrade', 'quantity'],
	});
