import { and, eq } from 'drizzle-orm';
import { CreateUserHeroDto, UpdateUserHeroDto } from '@/db/dto/user-hero-dto';
import { getDb } from '@/db/middleware';
import { userHeroes } from '@/db/tables/user-heroes-table';

export const userHeroRepository = {
	async create(dto: CreateUserHeroDto) {
		const db = getDb();
		const result = await db
			.insert(userHeroes)
			.values({ userId: dto.userId, heroId: dto.heroId })
			.returning();
		return result;
	},

	async getAllByUserId(userId: number) {
		const db = getDb();
		const result = await db.query.userHeroes.findMany({
			where: eq(userHeroes.userId, userId),
			with: {
				hero: true,
			},
		});
		return result;
	},

	async getByIdAndUserId(id: number, userId: number) {
		const db = getDb();
		const result = await db
			.select()
			.from(userHeroes)
			.where(and(eq(userHeroes.id, id), eq(userHeroes.userId, userId)));
		return result[0];
	},

	async getByHeroIdAndUserId(heroId: number, userId: number) {
		const db = getDb();
		const result = await db
			.select()
			.from(userHeroes)
			.where(and(eq(userHeroes.heroId, heroId), eq(userHeroes.userId, userId)));
		return result[0];
	},

	async get(id: number) {
		const db = getDb();
		const result = await db.query.userHeroes.findFirst({
			where: eq(userHeroes.id, id),
			with: {
				hero: true,
			},
		});
		return result;
	},

	async update(id: number, dto: UpdateUserHeroDto) {
		const db = getDb();
		const result = await db
			.update(userHeroes)
			.set({ upgrade: dto.upgrade })
			.where(and(eq(userHeroes.id, id), eq(userHeroes.userId, dto.userId)))
			.returning();
		return result;
	},

	async delete(id: number) {
		const db = getDb();
		const result = await db.delete(userHeroes).where(eq(userHeroes.id, id)).returning();
		return result;
	},
};
