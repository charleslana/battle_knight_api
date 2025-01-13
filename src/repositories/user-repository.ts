import { eq } from 'drizzle-orm';
import { getDb } from '@/db/middleware';
import { lower } from '@/db/schemas/common-schema';
import { UpdateUserDto } from '@/db/dto/user-dto';
import { users } from '@/db/schema';

export const userRepository = {
	async create(email: string, password: string) {
		const db = getDb();
		const result = await db.insert(users).values({ email, password }).returning();
		return result;
	},

	async getAllPaginated(page: number, pageSize: number) {
		const db = getDb();
		const offset = (page - 1) * pageSize;
		const results = await db.select().from(users).limit(pageSize).offset(offset);
		const totalCount = await db
			.select({ count: users.id })
			.from(users)
			.then((rows) => rows.length);
		return {
			results,
			totalCount,
			totalPages: Math.ceil(totalCount / pageSize),
			currentPage: page,
			hasNextPage: page * pageSize < totalCount,
		};
	},

	async get(id: number) {
		const db = getDb();
		const result = await db.select().from(users).where(eq(users.id, id));
		return result[0];
	},

	async update(id: number, dto: Partial<UpdateUserDto>) {
		const db = getDb();
		const result = await db
			.update(users)
			.set({ email: dto.email, name: dto.name, password: dto.password })
			.where(eq(users.id, id))
			.returning();
		return result;
	},

	async delete(id: number) {
		const db = getDb();
		const result = await db.delete(users).where(eq(users.id, id)).returning();
		return result;
	},

	async findByEmail(email: string) {
		const db = getDb();
		const result = await db
			.select()
			.from(users)
			.where(eq(lower<string>(users.email), email.toLowerCase()));
		if (!result.length) {
			return null;
		}
		return result;
	},

	async findByName(name: string) {
		const db = getDb();
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
