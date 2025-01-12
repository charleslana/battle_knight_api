import { customLogger } from '@/middleware/custom-logger';
import { dbMiddleware } from '@/db/middleware';
import { errorHandler } from './shared/error-handler';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { userRoute } from './routes/user-route';
import type { Env, Variables } from '@/lib/types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use(logger(customLogger));

app.use(dbMiddleware);

app.route('/api/v1/user', userRoute);

app.onError(errorHandler);

app.notFound((c) => {
	return c.json({ message: 'not found' });
});

export default app;
