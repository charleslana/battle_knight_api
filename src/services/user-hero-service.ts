import { BusinessException } from '@/shared/BusinessException';
import { CreateUserHeroDto, UpdateUserHeroDto } from '@/db/dto/user-hero-dto';
import { heroService } from './hero-service';
import { userHeroRepository } from '@/repositories/user-hero-repository';
import { userService } from './user-service';

export const userHeroService = {
	async getAll(userId: number) {
		return await userHeroRepository.getAllByUserId(userId);
	},

	async get(id: number) {
		const userHero = await userHeroRepository.get(id);
		if (!userHero) {
			throw new BusinessException('Herói do usuário não encontrado', 404);
		}
		return userHero;
	},

	async create(dto: CreateUserHeroDto) {
		await userService.get(dto.userId);
		await heroService.get(dto.heroId);
		const userHero = await userHeroRepository.getByHeroIdAndUserId(dto.heroId, dto.userId);
		if (userHero) {
			throw new BusinessException('Herói do usuário já existe cadastrado', 400);
		}
		return await userHeroRepository.create(dto);
	},

	async update(id: number, dto: UpdateUserHeroDto) {
		const userHero = await getByIdAndUserId(id, dto.userId);
		return await userHeroRepository.update(userHero.id, dto);
	},

	async remove(id: number) {
		const userHero = await this.get(id);
		return await userHeroRepository.delete(userHero.id);
	},
};

const getByIdAndUserId = async (id: number, userId: number) => {
	const userHero = await userHeroRepository.getByIdAndUserId(id, userId);
	if (!userHero) {
		throw new BusinessException('Herói do usuário não encontrado', 404);
	}
	return userHero;
};
