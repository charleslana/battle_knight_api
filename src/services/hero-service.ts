import { BusinessException } from '@/shared/BusinessException';
import { CreateHeroDto, UpdateHeroDto } from '@/db/dto/hero-dto';
import { heroRepository } from '@/repositories/hero-repository';
import { successResponse } from '@/shared/success-response';

export const heroService = {
	async getAll() {
		return await heroRepository.getAll();
	},

	async get(id: number) {
		const hero = await heroRepository.get(id);
		if (!hero) {
			throw new BusinessException('Herói não encontrado', 404);
		}
		return hero;
	},

	async create(dto: CreateHeroDto) {
		await heroRepository.create(dto);
		return successResponse('Herói criado com sucesso', 201);
	},

	async update(id: number, dto: Partial<UpdateHeroDto>) {
		const hero = await this.get(id);
		return await heroRepository.update(hero.id, dto);
	},

	async remove(id: number) {
		const hero = await this.get(id);
		await heroRepository.delete(hero.id);
		return successResponse('Herói removido com sucesso', 200);
	},
};
