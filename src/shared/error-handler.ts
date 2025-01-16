import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { log } from './log-pino';
import { z } from 'zod';

export const errorHandler = (err: Error | HTTPException, c: Context) => {
	log.info('=== Caught Error ===');
	if (err instanceof HTTPException) {
		return c.json({ error: true, message: err.message }, err.status);
	}
	if (err instanceof z.ZodError) {
		return c.json(err.errors.map((err) => err.message).join(',\n'), 400);
	}
	log.error(err);
	return c.json(
		{
			error: true,
			message:
				'Ocorreu um erro interno com o servidor. Entre em contato com o administrador e tente novamente.',
		},
		500
	);
};
