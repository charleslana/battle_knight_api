import { AuthDto } from '@/db/dto/auth-dto';
import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateUserDto, UpdateUserDto } from '@/db/dto/user-dto';
import { Hono } from 'hono';
import { insertUserSchema, updateUserSchema } from '@/db/schemas/user-schema';
import { paginationSchema, paramsSchema } from '@/db/schemas/common-schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { userService } from '@/services/user-service';
import { zValidator } from '@hono/zod-validator';

export const userController = new Hono();

userController.post('/', zValidator('json', insertUserSchema), async (c) => {
	const dto: CreateUserDto = c.req.valid('json');
	console.log(`REST: create user: ${dto.email}`);
	return await userService.create(c, dto.email, dto.password);
});

userController.get('/me', authMiddleware, async (c) => {
	const payload = c.get('jwtPayload') as null | AuthDto;
	let userId = 0;
	if (payload) {
		userId = payload.id;
	}
	console.log(`REST: get user me: ${userId}`);
	const user = await userService.get(c, userId);
	return c.json(user, 200);
});

userController.get('/', authMiddleware, zValidator('query', paginationSchema), async (c) => {
	const { page, pageSize } = c.req.valid('query');
	console.log(`REST: get all users paginated page: ${page} page size: ${pageSize}`);
	const users = await userService.getAllPaginated(c, page, pageSize);
	return c.json(users, 200);
});

userController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	console.log(`REST: get user: ${id}`);
	const user = await userService.get(c, id);
	return c.json(user, 200);
});

userController.put('/', authMiddleware, zValidator('json', updateUserSchema), async (c) => {
	const payload = c.get('jwtPayload') as null | AuthDto;
	let userId = 0;
	if (payload) {
		userId = payload.id;
	}
	const dto: Partial<UpdateUserDto> = c.req.valid('json');
	console.log(`REST: update user ${JSON.stringify(dto)} with id: ${userId}`);
	const updatedUser = await userService.update(c, userId, dto);
	return c.json(updatedUser[0], 200);
});

userController.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		console.log(`REST: delete user: ${id}`);
		return await userService.remove(c, id);
	}
);
