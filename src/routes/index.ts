import { authRoute } from './auth-route';
import { Hono } from 'hono';
import { userRoute } from './user-route';

const routes = new Hono();

routes.route('/api/v1/user/auth', authRoute);
routes.route('/api/v1/user', userRoute);

export { routes };
