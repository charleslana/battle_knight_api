import { authMiddleware } from '@/middleware/auth-middleware';
import { Hono } from 'hono';
import { insertUserSchema, updateUserSchema } from '@/db/schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { userController } from '@/controllers/user-controller';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const userRoute = new Hono();

userRoute.post('/', zValidator('json', insertUserSchema), userController.create);

userRoute.get('/me', authMiddleware, userController.getMe);

userRoute.get('/', userController.getAll);

userRoute.get(
	'/:id',
	zValidator(
		'param',
		z.object({
			id: z.coerce.number(),
		})
	),
	userController.get
);

userRoute.put(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator(
		'param',
		z.object({
			id: z.coerce.number(),
		})
	),
	zValidator('json', updateUserSchema),
	userController.update
);

userRoute.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator(
		'param',
		z.object({
			id: z.coerce.number(),
		})
	),
	userController.remove
);
