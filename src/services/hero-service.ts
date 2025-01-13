import { BusinessException } from '@/shared/BusinessException';
import { CreateHeroDto, UpdateHeroDto } from '@/db/dto/hero-dto';
import { heroRepository } from '@/repositories/hero-repository';
import { successResponse } from '@/shared/success-response';
import type { Context } from 'hono';

export const heroService = {
	async getAll(c: Context) {
		return await heroRepository.getAll(c);
	},

	async get(c: Context, id: number) {
		const hero = await heroRepository.get(c, id);
		if (!hero) {
			throw new BusinessException('Herói não encontrado', 404);
		}
		return hero;
	},

	async create(c: Context, dto: CreateHeroDto) {
		await heroRepository.create(c, dto);
		return successResponse(c, 'Herói criado com sucesso', 201);
	},

	async update(c: Context, id: number, dto: Partial<UpdateHeroDto>) {
		const hero = await this.get(c, id);
		return await heroRepository.update(c, hero.id, dto);
	},

	async remove(c: Context, id: number) {
		const hero = await this.get(c, id);
		await heroRepository.delete(c, hero.id);
		return successResponse(c, 'Herói removido com sucesso', 200);
	},
};
