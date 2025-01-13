import { heroes } from './heroes-table';
import { integer, pgTable, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users-table';

export const userHeroes = pgTable(
	'user_heroes',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		heroId: integer('hero_id')
			.notNull()
			.references(() => heroes.id, { onDelete: 'cascade' }),
		upgrade: integer('upgrade').default(0).notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex('user_heroes_user_id_hero_id_idx').on(table.userId, table.heroId)]
);

export const userHeroRelations = relations(userHeroes, ({ one }) => ({
	hero: one(heroes, {
		fields: [userHeroes.heroId],
		references: [heroes.id],
	}),
}));
