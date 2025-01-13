import { Context } from 'hono';
import { CreateHeroDto, UpdateHeroDto } from '@/db/dto/hero-dto';
import { Env, Variables } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { heroes } from '@/db/schema';

export const heroRepository = {
	async create(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		dto: CreateHeroDto
	) {
		const db = c.get('db');
		const result = await db.insert(heroes).values({ name: dto.name, image: dto.image }).returning();
		return result;
	},

	async getAll(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>
	) {
		const db = c.get('db');
		const result = await db.select().from(heroes);
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
		const result = await db.select().from(heroes).where(eq(heroes.id, id));
		return result[0];
	},

	async update(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number,
		dto: Partial<UpdateHeroDto>
	) {
		const db = c.get('db');
		const result = await db
			.update(heroes)
			.set({ name: dto.name, image: dto.image })
			.where(eq(heroes.id, id))
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
		const result = await db.delete(heroes).where(eq(heroes.id, id)).returning();
		return result;
	},
};
