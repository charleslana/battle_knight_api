import { authController } from '@/controllers/auth-controller';
import { authUserSchema } from '@/db/schema';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

export const authRoute = new Hono();

authRoute.post('/', zValidator('json', authUserSchema), authController.login);
