import { createInsertSchema } from 'drizzle-zod';
import { users } from '../tables/users-table';

export const insertUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email().max(255),
	password: (schema) => schema.password.min(6).max(50),
}).pick({ email: true, password: true });

export const updateUserSchema = createInsertSchema(users, {
	// id: (schema) => schema.id.int().min(1).default(0),
	email: (schema) => schema.email.email().max(255).optional(),
	password: (schema) => schema.password.min(6).max(50).optional(),
	name: (schema) =>
		schema.name
			.trim()
			.min(3, 'O nome deve ter pelo menos 3 caracteres.')
			.max(20, 'O nome pode ter no máximo 20 caracteres.')
			.regex(
				/^[a-zA-Z0-9_ ]+$/,
				'O nome deve conter apenas caracteres alfanuméricos, underscore (_) ou espaços.'
			)
			.optional(),
}).pick({ email: true, password: true, name: true });

export const authUserSchema = createInsertSchema(users, {
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password,
}).pick({ email: true, password: true });
