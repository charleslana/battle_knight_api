import { authRoute } from './auth-route';
import { Hono } from 'hono';
import { swaggerRoute } from '@/config/swagger';
import { userRoute } from './user-route';

const routes = new Hono();

routes.route('/api/v1/user/auth', authRoute);
routes.route('/api/v1/user', userRoute);
routes.route('/', swaggerRoute);

export { routes };
