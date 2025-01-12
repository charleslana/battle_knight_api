import bcrypt from 'bcryptjs';
import { BusinessException } from '@/shared/BusinessException';
import { Env, Variables } from '@/lib/types';
import { sign, verify } from 'hono/jwt';
import { userService } from './user-service';
import type { Context } from 'hono';

export const authService = {
	async authenticate(c: Context, email: string, password: string) {
		const context = c as Context<{
			Bindings: Env;
			Variables: Variables;
		}>;
		const find = await userService.findByEmail(context, email);
		if (!find) {
			throw new BusinessException('Credenciais não encontrada', 404);
		}
		const user = find[0];
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new BusinessException('Credenciais inválidas', 401);
		}
		const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hora
		const payload = { id: user.id, role: user.role, exp: expiresIn };
		const token = await sign(payload, context.env.JWT_SECRET);
		return { token };
	},

	async verifyToken(token: string, secret: string) {
		try {
			return await verify(token, secret);
		} catch (error) {
			throw new BusinessException('Token inválido ou expirado', 401);
		}
	},
};
