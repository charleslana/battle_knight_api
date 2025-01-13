import { authService } from '@/services/auth-service';
import { authUserSchema } from '@/db/schemas/user-schema';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

export const authController = new Hono();

authController.post('/', zValidator('json', authUserSchema), async (c) => {
	const { email, password } = c.req.valid('json');
	console.log(`REST: Login attempt for email: ${email}`);
	const { token } = await authService.authenticate(email, password);
	return c.json({ error: false, message: 'Autenticado com sucesso', token }, 200);
});
