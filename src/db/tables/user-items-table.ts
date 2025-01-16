import { integer, pgTable, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { items } from './items-table';
import { relations } from 'drizzle-orm';
import { users } from './users-table';

export const userItems = pgTable(
	'user_items',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		itemId: integer('item_id')
			.notNull()
			.references(() => items.id, { onDelete: 'cascade' }),
		upgrade: integer('upgrade').default(0).notNull(),
		quantity: integer('quantity').default(1).notNull(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex('user_items_user_id_item_id_idx').on(table.userId, table.itemId)]
);

export const userItemRelations = relations(userItems, ({ one }) => ({
	item: one(items, {
		fields: [userItems.itemId],
		references: [items.id],
	}),
}));
