import { MiddlewareHandler } from 'hono';

export const roleAdminMiddleware: MiddlewareHandler = async (c, next) => {
	const payload = c.get('jwtPayload') as { role?: string };
	if (!payload || payload.role !== 'admin') {
		return c.json(
			{ error: true, message: 'Acesso negado. Somente administradores podem acessar esta rota.' },
			403
		);
	}
	await next();
};
