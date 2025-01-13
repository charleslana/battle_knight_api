import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';
import { z } from 'zod';

export function lower<T>(text: AnyPgColumn): SQL {
	return sql<T>`lower(
	${text}
	)`;
}

export const MAX_INT = 2_147_483_647;

export const paramsSchema = z.object({
	id: z.coerce.number().int().min(1).max(MAX_INT),
});

export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).max(MAX_INT).default(1),
	pageSize: z.coerce.number().int().min(1).max(MAX_INT).default(10),
});
