import { BusinessException } from '@/shared/BusinessException';
import { CreateItemDto, UpdateItemDto } from '@/db/dto/item-dto';
import { itemRepository } from '@/repositories/item-repository';
import { successResponse } from '@/shared/success-response';

export const itemService = {
	async getAll() {
		return await itemRepository.getAll();
	},

	async get(id: number) {
		const item = await itemRepository.get(id);
		if (!item) {
			throw new BusinessException('Item não encontrado', 404);
		}
		return item;
	},

	async create(dto: CreateItemDto) {
		await itemRepository.create(dto);
		return successResponse('Item criado com sucesso', 201);
	},

	async update(id: number, dto: Partial<UpdateItemDto>) {
		const item = await this.get(id);
		return await itemRepository.update(item.id, dto);
	},

	async remove(id: number) {
		const item = await this.get(id);
		await itemRepository.delete(item.id);
		return successResponse('Item removido com sucesso', 200);
	},
};
