import { Context, MiddlewareHandler } from 'hono';
import { Env, Variables } from '@/lib/types';

export const restrictMiddleware: MiddlewareHandler = async (
	c: Context<{
		Bindings: Env;
		Variables: Variables;
	}>,
	next
) => {
	const key = c.req.query('key');
	if (key === '' || key !== c.env.VALID_KEY) {
		return c.json({ error: true, message: 'Acesso negado. chave inválida.' }, 403);
	}
	await next();
};
