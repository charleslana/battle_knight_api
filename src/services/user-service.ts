import bcrypt from 'bcryptjs';
import { BusinessException } from '@/shared/BusinessException';
import { successResponse } from '@/shared/success-response';
import { UpdateUserDto } from '@/db/dto/user-dto';
import { userRepository } from '@/repositories/user-repository';
import type { Context } from 'hono';

export const userService = {
	async getAllPaginated(c: Context, page: number, pageSize: number) {
		const data = await userRepository.getAllPaginated(c, page, pageSize);
		const results = data.results.map((user) => {
			const { password, ...rest } = user;
			return rest;
		});
		return {
			...data,
			results,
		};
	},

	async get(c: Context, id: number) {
		const user = await userRepository.get(c, id);
		if (!user) {
			throw new BusinessException('Usuário não encontrado', 404);
		}
		const { password, ...rest } = user;
		return rest;
	},

	async create(c: Context, email: string, password: string) {
		const existingEmail = await this.findByEmail(c, email);
		if (existingEmail !== null) {
			throw new BusinessException('Já existe um usuário com este email', 400);
		}
		const passwordHash = await hashPassword(password);
		await userRepository.create(c, email, passwordHash);
		return successResponse(c, 'Usuário criado com sucesso', 201);
	},

	async update(c: Context, id: number, dto: Partial<UpdateUserDto>) {
		const user = await this.get(c, id);
		if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
			const existingEmail = await this.findByEmail(c, dto.email);
			if (existingEmail) {
				throw new BusinessException('Já existe um usuário com este email', 400);
			}
		}
		if (dto.name && dto.name.toLowerCase() !== user.name?.toLowerCase()) {
			const existingEmail = await findByName(c, dto.name);
			if (existingEmail) {
				throw new BusinessException('Já existe um usuário com este nome', 400);
			}
		}
		if (dto.password) {
			dto.password = await hashPassword(dto.password);
		}
		const usersUpdated = await userRepository.update(c, user.id, dto);
		return usersUpdated.map((userUpdated) => {
			const { password, role, ...rest } = userUpdated;
			return rest;
		});
	},

	async remove(c: Context, id: number) {
		const user = await this.get(c, id);
		if (user.role === 'admin') {
			throw new BusinessException('Usuário administrador não pode ser removido', 403);
		}
		await userRepository.delete(c, user.id);
		return successResponse(c, 'Usuário removido com sucesso', 200);
	},

	async findByEmail(c: Context, email: string) {
		return await userRepository.findByEmail(c, email);
	},
};

const findByName = async (c: Context, name: string) => {
	return await userRepository.findByName(c, name);
};

const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};
