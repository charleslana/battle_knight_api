import { authService } from '@/services/auth-service';
import { authUserSchema } from '@/db/schemas/user-schema';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { log } from '@/shared/log-pino';

export const authController = new Hono();

authController.post('/', zValidator('json', authUserSchema), async (c) => {
	const { email, password } = c.req.valid('json');
	log.info('REST: Login attempt', { email });
	const { token, userId } = await authService.authenticate(email, password);
	return c.json({ error: false, message: 'Autenticado com sucesso', token, userId }, 200);
});
