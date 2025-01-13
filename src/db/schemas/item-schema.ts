import { createInsertSchema } from 'drizzle-zod';
import { items } from '../tables/items-table';

export const insertItemSchema = createInsertSchema(items, {
	name: (schema) => schema.name.trim().min(1).max(255),
	image: (schema) => schema.image.trim().min(1).max(255),
}).pick({ name: true, image: true });

export const updateItemSchema = createInsertSchema(items, {
	name: (schema) =>
		schema.name
			.trim()
			.min(1)
			.max(255)
			.transform((value) => value.trim())
			.optional(),
	image: (schema) =>
		schema.image
			.trim()
			.min(1)
			.max(255)
			.transform((value) => value.trim())
			.optional(),
}).pick({ name: true, image: true });
