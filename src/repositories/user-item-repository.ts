import { and, eq } from 'drizzle-orm';
import { CreateUserItemDto, UpdateUserItemDto } from '@/db/dto/user-item-dto';
import { getDb } from '@/db/middleware';
import { userItems } from '@/db/schema';

export const userItemRepository = {
	async create(dto: CreateUserItemDto) {
		const db = getDb();
		const result = await db
			.insert(userItems)
			.values({ userId: dto.userId, itemId: dto.itemId })
			.returning();
		return result;
	},

	async getAllByUserId(userId: number) {
		const db = getDb();
		const result = await db.query.userItems.findMany({
			where: eq(userItems.userId, userId),
			with: {
				item: true,
			},
		});
		return result;
	},

	async getByIdAndUserId(id: number, userId: number) {
		const db = getDb();
		const result = await db
			.select()
			.from(userItems)
			.where(and(eq(userItems.id, id), eq(userItems.userId, userId)));
		return result[0];
	},

	async getByItemIdAndUserId(itemId: number, userId: number) {
		const db = getDb();
		const result = await db
			.select()
			.from(userItems)
			.where(and(eq(userItems.itemId, itemId), eq(userItems.userId, userId)));
		return result[0];
	},

	async get(id: number) {
		const db = getDb();
		const result = await db.query.userItems.findFirst({
			where: eq(userItems.id, id),
			with: {
				item: true,
			},
		});
		return result;
	},

	async update(id: number, dto: UpdateUserItemDto) {
		const db = getDb();
		const result = await db
			.update(userItems)
			.set({ upgrade: dto.upgrade, quantity: dto.quantity })
			.where(and(eq(userItems.id, id), eq(userItems.userId, dto.userId)))
			.returning();
		return result;
	},

	async delete(id: number) {
		const db = getDb();
		const result = await db.delete(userItems).where(eq(userItems.id, id)).returning();
		return result;
	},
};
