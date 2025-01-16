import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateItemDto, UpdateItemDto } from '@/db/dto/item-dto';
import { Hono } from 'hono';
import { insertItemSchema, updateItemSchema } from '@/db/schemas/item-schema';
import { itemService } from '@/services/item-service';
import { log } from '@/shared/log-pino';
import { paramsSchema } from '@/db/schemas/common-schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { zValidator } from '@hono/zod-validator';

export const itemController = new Hono();

itemController.post(
	'/',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('json', insertItemSchema),
	async (c) => {
		const dto: CreateItemDto = c.req.valid('json');
		log.info('REST: create item:', { dto });
		return await itemService.create(dto);
	}
);

itemController.get('/', authMiddleware, async (c) => {
	log.info('REST: get all items');
	const items = await itemService.getAll();
	return c.json(items, 200);
});

itemController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	log.info('REST: get item:', { id });
	const item = await itemService.get(id);
	return c.json(item, 200);
});

itemController.put(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	zValidator('json', updateItemSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		const dto: Partial<UpdateItemDto> = c.req.valid('json');
		log.info('REST: update item:', { dto, id });
		const updatedItem = await itemService.update(id, dto);
		return c.json(updatedItem[0], 200);
	}
);

itemController.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		log.info('REST: delete item:', { id });
		return await itemService.remove(id);
	}
);
