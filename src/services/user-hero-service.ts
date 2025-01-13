import { BusinessException } from '@/shared/BusinessException';
import { CreateUserHeroDto, UpdateUserHeroDto } from '@/db/dto/user-hero-dto';
import { heroService } from './hero-service';
import { userHeroRepository } from '@/repositories/user-hero-repository';
import { userService } from './user-service';
import type { Context } from 'hono';

export const userHeroService = {
	async getAll(c: Context, userId: number) {
		return await userHeroRepository.getAllByUserId(c, userId);
	},

	async get(c: Context, id: number) {
		const userHero = await userHeroRepository.get(c, id);
		if (!userHero) {
			throw new BusinessException('Herói do usuário não encontrado', 404);
		}
		return userHero;
	},

	async create(c: Context, dto: CreateUserHeroDto) {
		await userService.get(c, dto.userId);
		await heroService.get(c, dto.heroId);
		const userHero = await userHeroRepository.getByHeroIdAndUserId(c, dto.heroId, dto.userId);
		if (userHero) {
			throw new BusinessException('Herói do usuário já existe cadastrado', 400);
		}
		return await userHeroRepository.create(c, dto);
	},

	async update(c: Context, id: number, dto: UpdateUserHeroDto) {
		const userHero = await getByIdAndUserId(c, id, dto.userId);
		return await userHeroRepository.update(c, userHero.id, dto);
	},

	async remove(c: Context, id: number) {
		const userHero = await this.get(c, id);
		return await userHeroRepository.delete(c, userHero.id);
	},
};

const getByIdAndUserId = async (c: Context, id: number, userId: number) => {
	const userHero = await userHeroRepository.getByIdAndUserId(c, id, userId);
	if (!userHero) {
		throw new BusinessException('Herói do usuário não encontrado', 404);
	}
	return userHero;
};
