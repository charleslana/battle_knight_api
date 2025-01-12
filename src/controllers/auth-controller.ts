import { authService } from '@/services/auth-service';
import { Context } from 'hono';

export const authController = {
	async login(c: Context) {
		const { email, password } = await c.req.json();
		console.log(`REST: Login attempt for email: ${email}`);
		const { token } = await authService.authenticate(c, email, password);
		return c.json({ error: false, message: 'Autenticado com sucesso', token }, 200);
	},
};
