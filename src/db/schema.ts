import { AnyPgColumn, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { SQL, sql } from 'drizzle-orm';

export function lower<T>(text: AnyPgColumn): SQL {
	return sql<T>`lower(
	${text}
	)`;
}

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	password: text('password').notNull(),
	name: varchar('name', { length: 20 }).unique(),
});

export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password.min(6).max(50),
}).pick({ email: true, password: true });

export const updateUserSchema = createInsertSchema(users, {
	id: (schema) => schema.id.int().min(1).default(0),
	email: (schema) => schema.email.email().max(255).optional(),
	password: (schema) => schema.password.min(6).max(50).optional(),
	name: (schema) => schema.name.min(3).max(20).trim().optional(),
}).pick({ id: true, email: true, password: true, name: true });
