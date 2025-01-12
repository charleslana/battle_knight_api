import { authService } from '@/services/auth-service';
import { BusinessException } from '@/shared/BusinessException';
import { Context } from 'hono';
import { Env, Variables } from '@/lib/types';

export const authMiddleware = async (
	c: Context<{
		Bindings: Env;
		Variables: Variables;
	}>,
	next: () => Promise<void>
) => {
	const authHeader = c.req.header('Authorization');
	if (!authHeader) {
		throw new BusinessException('Token não fornecido', 401);
	}
	const token = authHeader.split(' ')[1]; // Exemplo: "Bearer <token>"
	if (!token) {
		throw new BusinessException('Token inválido', 401);
	}
	const payload = await authService.verifyToken(token, c.env.JWT_SECRET);
	c.set('jwtPayload', payload);
	await next();
};
