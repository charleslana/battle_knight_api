import { createInsertSchema } from 'drizzle-zod';
import { heroes } from '../tables/heroes-table';

export const insertHeroSchema = createInsertSchema(heroes, {
	name: (schema) => schema.name.trim().min(1).max(255),
	image: (schema) => schema.image.trim().min(1).max(255),
}).pick({ name: true, image: true });

export const updateHeroSchema = createInsertSchema(heroes, {
	name: (schema) =>
		schema.name
			.trim()
			.min(1, 'O campo nome é obrigatório.')
			.max(255, 'O campo nome pode ter no máximo 255 caracteres.')
			.transform((value) => value.trim())
			.optional(),
	image: (schema) =>
		schema.image
			.trim()
			.min(1, 'O campo imagem é obrigatório.')
			.max(255, 'O campo imagem pode ter no máximo 255 caracteres.')
			.transform((value) => value.trim())
			.optional(),
}).pick({ name: true, image: true });
