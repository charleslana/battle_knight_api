import { AuthDto } from '@/db/dto/auth-dto';
import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateUserDto, UpdateUserDto } from '@/db/dto/user-dto';
import { Hono } from 'hono';
import { insertUserSchema, updateUserSchema } from '@/db/schemas/user-schema';
import { log } from '@/shared/log-pino';
import { paginationSchema, paramsSchema } from '@/db/schemas/common-schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { userService } from '@/services/user-service';
import { zValidator } from '@hono/zod-validator';

export const userController = new Hono();

userController.post('/', zValidator('json', insertUserSchema), async (c) => {
	const dto: CreateUserDto = c.req.valid('json');
	log.info('REST: create user:', { dto: dto.email });
	return await userService.create(dto.email, dto.password);
});

userController.get('/me', authMiddleware, async (c) => {
	const payload = c.get('jwtPayload') as null | AuthDto;
	let userId = 0;
	if (payload) {
		userId = payload.id;
	}
	log.info('REST: get user me:', { userId });
	const user = await userService.get(userId);
	return c.json(user, 200);
});

userController.get('/', authMiddleware, zValidator('query', paginationSchema), async (c) => {
	const { page, pageSize } = c.req.valid('query');
	log.info('REST: get all users paginated page:', { page, pageSize });
	const users = await userService.getAllPaginated(page, pageSize);
	return c.json(users, 200);
});

userController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	log.info('REST: get user:', { id });
	const user = await userService.get(id);
	return c.json(user, 200);
});

userController.put('/', authMiddleware, zValidator('json', updateUserSchema), async (c) => {
	const payload = c.get('jwtPayload') as null | AuthDto;
	let userId = 0;
	if (payload) {
		userId = payload.id;
	}
	const dto: Partial<UpdateUserDto> = c.req.valid('json');
	log.info('REST: update user:', { dto, userId });
	const updatedUser = await userService.update(userId, dto);
	return c.json(updatedUser[0], 200);
});

userController.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		log.info('REST: delete user:', { id });
		return await userService.remove(id);
	}
);
