import { MAX_INT } from './common-schema';
import { z } from 'zod';

export const insertUserHeroSchema = z
	.object({
		userId: z.coerce.number().int().min(1).max(MAX_INT),
		heroId: z.coerce.number().int().min(1).max(MAX_INT),
	})
	.pick({ userId: true, heroId: true });

export const updateUserHeroSchema = z
	.object({
		userId: z.coerce.number().int().min(1).max(MAX_INT),
		upgrade: z.coerce.number().int().min(0).max(MAX_INT),
	})
	.pick({ userId: true, upgrade: true });
