import { Hono } from 'hono';
import { insertUserSchema, updateUserSchema } from '@/db/schema';
import { userController } from '@/controllers/user-controller';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const userRoute = new Hono();

userRoute.post('/', zValidator('json', insertUserSchema), userController.create);

userRoute.get('/', userController.fetchAll);

userRoute.get(
	'/:id',
	zValidator(
		'param',
		z.object({
			id: z.coerce.number(),
		})
	),
	userController.fetch
);

userRoute.put(
	'/:id',
	zValidator(
		'param',
		z.object({
			id: z.coerce.number(),
		})
	),
	zValidator('json', updateUserSchema),
	userController.modify
);

userRoute.delete(
	'/:id',
	zValidator(
		'param',
		z.object({
			id: z.coerce.number(),
		})
	),
	userController.remove
);
