import { clientAuthMiddleware } from './middleware/client-auth-middleware';
import { contextMiddleware, dbMiddleware } from '@/db/middleware';
import { customLogger } from '@/middleware/custom-logger';
import { errorHandler } from './shared/error-handler';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { routes } from './routes/routes';
import type { Env, Variables } from '@/lib/types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use(logger(customLogger));

app.use(contextMiddleware);

app.use(dbMiddleware);

app.use(clientAuthMiddleware);

app.route('/', routes);

app.onError(errorHandler);

app.notFound((c) => {
	return c.json({ error: true, message: 'Rota não encontrada' }, 404);
});

export default app;
