import { authController } from '@/controllers/auth-controller';
import { heroController } from '@/controllers/hero-controller';
import { Hono } from 'hono';
import { itemController } from '@/controllers/item-controller';
import { swaggerRoute } from '@/config/swagger';
import { userController } from '@/controllers/user-controller';
import { userHeroController } from '@/controllers/user-hero-controller';

const routes = new Hono();

routes.route('/api/v1/user/auth', authController);
routes.route('/api/v1/user/hero', userHeroController);
routes.route('/api/v1/user', userController);
routes.route('/api/v1/hero', heroController);
routes.route('/api/v1/item', itemController);
routes.route('/', swaggerRoute);

export { routes };
