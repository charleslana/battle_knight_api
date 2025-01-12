import { Context } from 'hono';
import { Env, Variables } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { lower } from '@/db/schemas/common-schema';
import { UpdateUserDto } from '@/db/dto/user-dto';
import { users } from '@/db/schema';

export const userRepository = {
	async create(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		email: string,
		password: string
	) {
		const db = c.get('db');
		const result = await db.insert(users).values({ email, password }).returning();
		return result;
	},

	async getAll(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>
	) {
		const db = c.get('db');
		const result = await db.select().from(users);
		return result;
	},

	async get(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number
	) {
		const db = c.get('db');
		const result = await db.select().from(users).where(eq(users.id, id));
		return result[0];
	},

	async update(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number,
		model: Partial<UpdateUserDto>
	) {
		const db = c.get('db');
		const result = await db
			.update(users)
			.set({ email: model.email, name: model.name, password: model.password })
			.where(eq(users.id, id))
			.returning();
		return result;
	},

	async delete(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number
	) {
		const db = c.get('db');
		const result = await db.delete(users).where(eq(users.id, id)).returning();
		return result;
	},

	async findByEmail(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		email: string
	) {
		const db = c.get('db');
		const result = await db
			.select()
			.from(users)
			.where(eq(lower<string>(users.email), email.toLowerCase()));
		if (!result.length) {
			return null;
		}
		return result;
	},

	async findByName(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		name: string
	) {
		const db = c.get('db');
		const result = await db
			.select()
			.from(users)
			.where(eq(lower<string>(users.name), name.toLowerCase()));
		if (!result.length) {
			return null;
		}
		return result;
	},
};
