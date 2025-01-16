import { authMiddleware } from '@/middleware/auth-middleware';
import { CreateHeroDto, UpdateHeroDto } from '@/db/dto/hero-dto';
import { heroService } from '@/services/hero-service';
import { Hono } from 'hono';
import { insertHeroSchema, updateHeroSchema } from '@/db/schemas/hero-schema';
import { log } from '@/shared/log-pino';
import { paramsSchema } from '@/db/schemas/common-schema';
import { roleAdminMiddleware } from '@/middleware/role-admin-middleware';
import { zValidator } from '@hono/zod-validator';

export const heroController = new Hono();

heroController.post(
	'/',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('json', insertHeroSchema),
	async (c) => {
		const dto: CreateHeroDto = c.req.valid('json');
		log.info('REST: create hero:', { dto });
		return await heroService.create(dto);
	}
);

heroController.get('/', authMiddleware, async (c) => {
	log.info('REST: get all heroes');
	const heroes = await heroService.getAll();
	return c.json(heroes, 200);
});

heroController.get('/:id', authMiddleware, zValidator('param', paramsSchema), async (c) => {
	const { id } = c.req.valid('param');
	log.info('REST: get hero:', { id });
	const hero = await heroService.get(id);
	return c.json(hero, 200);
});

heroController.put(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	zValidator('json', updateHeroSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		const dto: Partial<UpdateHeroDto> = c.req.valid('json');
		log.info('REST: update hero:', { dto, id });
		const updatedHero = await heroService.update(id, dto);
		return c.json(updatedHero[0], 200);
	}
);

heroController.delete(
	'/:id',
	authMiddleware,
	roleAdminMiddleware,
	zValidator('param', paramsSchema),
	async (c) => {
		const { id } = c.req.valid('param');
		log.info('REST: delete hero:', { id });
		return await heroService.remove(id);
	}
);
