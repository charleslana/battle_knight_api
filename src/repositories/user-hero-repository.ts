import { and, eq } from 'drizzle-orm';
import { Context } from 'hono';
import { CreateUserHeroDto, UpdateUserHeroDto } from '@/db/dto/user-hero-dto';
import { Env, Variables } from '@/lib/types';
import { userHeroes } from '@/db/tables/user-heroes-table';

export const userHeroRepository = {
	async create(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		dto: CreateUserHeroDto
	) {
		const db = c.get('db');
		const result = await db
			.insert(userHeroes)
			.values({ userId: dto.userId, heroId: dto.heroId })
			.returning();
		return result;
	},

	async getAllByUserId(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		userId: number
	) {
		const db = c.get('db');
		const result = await db.select().from(userHeroes).where(eq(userHeroes.userId, userId));
		return result;
	},

	async getByIdAndUserId(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number,
		userId: number
	) {
		const db = c.get('db');
		const result = await db
			.select()
			.from(userHeroes)
			.where(and(eq(userHeroes.id, id), eq(userHeroes.userId, userId)));
		return result[0];
	},

	async getByHeroIdAndUserId(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		heroId: number,
		userId: number
	) {
		const db = c.get('db');
		const result = await db
			.select()
			.from(userHeroes)
			.where(and(eq(userHeroes.heroId, heroId), eq(userHeroes.userId, userId)));
		return result[0];
	},

	async get(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number
	) {
		const db = c.get('db');
		const result = await db.select().from(userHeroes).where(eq(userHeroes.id, id));
		return result[0];
	},

	async update(
		c: Context<{
			Bindings: Env;
			Variables: Variables;
		}>,
		id: number,
		dto: UpdateUserHeroDto
	) {
		const db = c.get('db');
		const result = await db
			.update(userHeroes)
			.set({ upgrade: dto.upgrade })
			.where(and(eq(userHeroes.id, id), eq(userHeroes.userId, dto.userId)))
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
		const result = await db.delete(userHeroes).where(eq(userHeroes.id, id)).returning();
		return result;
	},
};
