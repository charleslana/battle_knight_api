import { AuthDto } from '@/db/dto/auth-dto';
import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateUserHeroDto, UpdateUserHeroDto } from '@/db/dto/user-hero-dto';
import { Hono } from 'hono';
import { insertUserHeroSchema, updateUserHeroSchema } from '@/db/schemas/user-hero-schema';
import { paramsSchema } from '@/db/schemas/common-schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { userHeroService } from '@/services/user-hero-service';
import { zValidator } from '@hono/zod-validator';

export const userHeroController = new Hono();

userHeroController.post(
	'/',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('json', insertUserHeroSchema),
	async (c) => {
		const dto: CreateUserHeroDto = c.req.valid('json');
		console.log(`REST: create user hero: ${JSON.stringify(dto)}`);
		const createdUserHero = await userHeroService.create(c, dto);
		return c.json(createdUserHero[0], 200);
	}
);

userHeroController.get('/', authMiddleware, async (c) => {
	const payload = c.get('jwtPayload') as null | AuthDto;
	let userId = 0;
	if (payload) {
		userId = payload.id;
	}
	console.log(`REST: get all user heroes with userId: ${userId}`);
	const userHeroes = await userHeroService.getAll(c, userId);
	return c.json(userHeroes, 200);
});

userHeroController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	console.log(`REST: get user hero: ${id}`);
	const userHero = await userHeroService.get(c, id);
	return c.json(userHero, 200);
});

userHeroController.put(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	zValidator('json', updateUserHeroSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		const dto: UpdateUserHeroDto = c.req.valid('json');
		console.log(
			`REST: update user hero ${JSON.stringify(dto)} with id: ${id} and userId: ${dto.userId}`
		);
		const updatedUserHero = await userHeroService.update(c, id, dto);
		return c.json(updatedUserHero[0], 200);
	}
);

userHeroController.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		console.log(`REST: delete user hero: ${id}`);
		const deletedUserHero = await userHeroService.remove(c, id);
		return c.json(deletedUserHero[0], 200);
	}
);
