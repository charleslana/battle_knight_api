import bcrypt from 'bcryptjs';
import { BusinessException } from '@/shared/BusinessException';
import { getContext } from '@/db/middleware';
import { sign, verify } from 'hono/jwt';
import { userService } from './user-service';

export const authService = {
	async authenticate(email: string, password: string) {
		const find = await userService.findByEmail(email);
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
		const context = getContext();
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
