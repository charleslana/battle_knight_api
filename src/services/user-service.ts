import bcrypt from 'bcryptjs';
import { BusinessException } from '@/shared/BusinessException';
import { successResponse } from '@/shared/success-response';
import { userRepository } from '@/repositories/user-repository';
import type { User } from '@/db/model';
import type { Context } from 'hono';

export const userService = {
	async getAll(c: Context) {
		const users = await userRepository.getAll(c);
		return users.map((user) => {
			const { password, ...rest } = user;
			return rest;
		});
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

	async update(c: Context, id: number, model: Partial<User>) {
		const user = await this.get(c, id);
		if (model.email && model.email.toLowerCase() !== user.email.toLowerCase()) {
			const existingEmail = await this.findByEmail(c, model.email);
			if (existingEmail) {
				throw new BusinessException('Já existe um usuário com este email', 400);
			}
		}
		if (model.name && model.name.toLowerCase() !== user.name?.toLowerCase()) {
			const existingEmail = await findByName(c, model.name);
			if (existingEmail) {
				throw new BusinessException('Já existe um usuário com este nome', 400);
			}
		}
		if (model.password) {
			model.password = await hashPassword(model.password);
		}
		return await userRepository.update(c, user.id, model);
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
