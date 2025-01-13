import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateItemDto, UpdateItemDto } from '@/db/dto/item-dto';
import { Hono } from 'hono';
import { insertItemSchema, updateItemSchema } from '@/db/schemas/item-schema';
import { itemService } from '@/services/item-service';
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
		console.log(`REST: create item: ${JSON.stringify(dto)}`);
		return await itemService.create(dto);
	}
);

itemController.get('/', authMiddleware, async (c) => {
	console.log('REST: get all items');
	const items = await itemService.getAll();
	return c.json(items, 200);
});

itemController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	console.log(`REST: get item: ${id}`);
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
		console.log(`REST: update item ${JSON.stringify(dto)} with id: ${id}`);
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
		console.log(`REST: delete item: ${id}`);
		return await itemService.remove(id);
	}
);
