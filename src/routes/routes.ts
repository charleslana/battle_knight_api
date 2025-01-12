import { authController } from '@/controllers/auth-controller';
import { heroController } from '@/controllers/hero-controller';
import { Hono } from 'hono';
import { swaggerRoute } from '@/config/swagger';
import { userController } from '@/controllers/user-controller';

const routes = new Hono();

routes.route('/api/v1/user/auth', authController);
routes.route('/api/v1/user', userController);
routes.route('/api/v1/hero', heroController);
routes.route('/', swaggerRoute);

export { routes };
