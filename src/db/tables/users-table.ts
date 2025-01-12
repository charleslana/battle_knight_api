import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'admin']);

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
