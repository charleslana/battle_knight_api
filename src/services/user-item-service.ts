import { BusinessException } from '@/shared/BusinessException';
import { CreateUserItemDto, UpdateUserItemDto } from '@/db/dto/user-item-dto';
import { itemService } from './item-service';
import { userItemRepository } from '@/repositories/user-item-repository';
import { userService } from './user-service';

export const userItemService = {
	async getAll(userId: number) {
		return await userItemRepository.getAllByUserId(userId);
	},

	async get(id: number) {
		const userItem = await userItemRepository.get(id);
		if (!userItem) {
			throw new BusinessException('Item do usuário não encontrado', 404);
		}
		return userItem;
	},

	async create(dto: CreateUserItemDto) {
		await userService.get(dto.userId);
		await itemService.get(dto.itemId);
		const userItem = await this.checkByUserIdAndItemIdExists(dto.userId, dto.itemId);
		if (userItem) {
			return null;
		}
		return await userItemRepository.create(dto);
	},

	async update(id: number, dto: UpdateUserItemDto) {
		const userItem = await getByIdAndUserId(id, dto.userId);
		return await userItemRepository.update(userItem.id, dto);
	},

	async remove(id: number) {
		const userItem = await this.get(id);
		return await userItemRepository.delete(userItem.id);
	},

	async checkByUserIdAndItemIdExists(userId: number, itemId: number) {
		return await userItemRepository.getByItemIdAndUserId(itemId, userId);
	},
};

const getByIdAndUserId = async (id: number, userId: number) => {
	const userItem = await userItemRepository.getByIdAndUserId(id, userId);
	if (!userItem) {
		throw new BusinessException('Item do usuário não encontrado', 404);
	}
	return userItem;
};
