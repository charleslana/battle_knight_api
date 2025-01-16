import { AuthDto } from '@/db/dto/auth-dto';
import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateUserItemDto, UpdateUserItemDto } from '@/db/dto/user-item-dto';
import { Hono } from 'hono';
import { insertUserItemSchema, updateUserItemSchema } from '@/db/schemas/user-item-schema';
import { log } from '@/shared/log-pino';
import { paramsSchema } from '@/db/schemas/common-schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { userItemService } from '@/services/user-item-service';
import { zValidator } from '@hono/zod-validator';

export const userItemController = new Hono();

userItemController.post(
	'/',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('json', insertUserItemSchema),
	async (c) => {
		const dto: CreateUserItemDto = c.req.valid('json');
		log.info('REST: create user item:', { dto });
		const createdUserItem = await userItemService.create(dto);
		return c.json(createdUserItem ? createdUserItem[0] : null, 200);
	}
);

userItemController.get('/', authMiddleware, async (c) => {
	const payload = c.get('jwtPayload') as null | AuthDto;
	let userId = 0;
	if (payload) {
		userId = payload.id;
	}
	log.info('REST: get all user items with userId:', { userId });
	const userItems = await userItemService.getAll(userId);
	return c.json(userItems, 200);
});

userItemController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	log.info('REST: get user item:', { id });
	const userItem = await userItemService.get(id);
	return c.json(userItem, 200);
});

userItemController.put(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	zValidator('json', updateUserItemSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		const dto: UpdateUserItemDto = c.req.valid('json');
		log.info('REST: update user item:', { id, dto });
		const updatedUserItem = await userItemService.update(id, dto);
		return c.json(updatedUserItem[0], 200);
	}
);

userItemController.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		log.info('REST: delete user item:', { id });
		const deletedUserItem = await userItemService.remove(id);
		return c.json(deletedUserItem[0], 200);
	}
);
