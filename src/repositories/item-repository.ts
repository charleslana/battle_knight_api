import { CreateItemDto, UpdateItemDto } from '@/db/dto/item-dto';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/middleware';
import { items } from '@/db/schema';

export const itemRepository = {
	async create(dto: CreateItemDto) {
		const db = getDb();
		const result = await db.insert(items).values({ name: dto.name, image: dto.image }).returning();
		return result;
	},

	async getAll() {
		const db = getDb();
		const result = await db.select().from(items);
		return result;
	},

	async get(id: number) {
		const db = getDb();
		const result = await db.select().from(items).where(eq(items.id, id));
		return result[0];
	},

	async update(id: number, dto: Partial<UpdateItemDto>) {
		const db = getDb();
		const result = await db
			.update(items)
			.set({ name: dto.name, image: dto.image })
			.where(eq(items.id, id))
			.returning();
		return result;
	},

	async delete(id: number) {
		const db = getDb();
		const result = await db.delete(items).where(eq(items.id, id)).returning();
		return result;
	},
};
