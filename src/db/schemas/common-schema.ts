import { AnyPgColumn } from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';

export function lower<T>(text: AnyPgColumn): SQL {
	return sql<T>`lower(
	${text}
	)`;
}
