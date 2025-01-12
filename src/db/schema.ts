import { createInsertSchema } from 'drizzle-zod';
import { SQL, sql } from 'drizzle-orm';
import {
	AnyPgColumn,
	pgEnum,
	pgTable,
	serial,
	text,
	varchar,
	integer,
	timestamp,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin']);

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
	role: roleEnum('role').default('user').notNull(),
	exp: integer('exp').default(0).notNull(),
	level: integer('level').default(1).notNull(),
	gold: integer('gold').default(1000).notNull(),
	silver: integer('silver').default(1000).notNull(),
	trophy: integer('trophy').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date()),
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

export const authUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password,
}).pick({ email: true, password: true });
