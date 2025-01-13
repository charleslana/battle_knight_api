import { CreateHeroDto, UpdateHeroDto } from '@/db/dto/hero-dto';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/middleware';
import { heroes } from '@/db/schema';

export const heroRepository = {
	async create(dto: CreateHeroDto) {
		const db = getDb();
		const result = await db.insert(heroes).values({ name: dto.name, image: dto.image }).returning();
		return result;
	},

	async getAll() {
		const db = getDb();
		const result = await db.select().from(heroes);
		return result;
	},

	async get(id: number) {
		const db = getDb();
		const result = await db.select().from(heroes).where(eq(heroes.id, id));
		return result[0];
	},

	async update(id: number, dto: Partial<UpdateHeroDto>) {
		const db = getDb();
		const result = await db
			.update(heroes)
			.set({ name: dto.name, image: dto.image })
			.where(eq(heroes.id, id))
			.returning();
		return result;
	},

	async delete(id: number) {
		const db = getDb();
		const result = await db.delete(heroes).where(eq(heroes.id, id)).returning();
		return result;
	},
};
