import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';
import { z } from 'zod';

export function lower<T>(text: AnyPgColumn): SQL {
	return sql<T>`lower(
	${text}
	)`;
}

export const paginationSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(1).max(100).default(10),
});
