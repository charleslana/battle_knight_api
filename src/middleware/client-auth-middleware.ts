import type { MiddlewareHandler } from 'hono';

export const clientAuthMiddleware: MiddlewareHandler = async (c, next) => {
	const url = new URL(c.req.url);
	if (url.pathname === '/ui' || url.pathname === '/ui/doc') {
		return next();
	}
	const clientId = c.req.header('client_id');
	const clientSecret = c.req.header('client_secret');
	if (clientId !== c.env.CLIENT_ID || clientSecret !== c.env.CLIENT_SECRET) {
		return c.json(
			{
				error: true,
				message: 'Acesso negado. cliente inválido',
			},
			403
		);
	}
	await next();
};
