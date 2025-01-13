import bcrypt from 'bcryptjs';
import { BusinessException } from '@/shared/BusinessException';
import { successResponse } from '@/shared/success-response';
import { UpdateUserDto } from '@/db/dto/user-dto';
import { userRepository } from '@/repositories/user-repository';

export const userService = {
	async getAllPaginated(page: number, pageSize: number) {
		const data = await userRepository.getAllPaginated(page, pageSize);
		const results = data.results.map((user) => {
			const { password, ...rest } = user;
			return rest;
		});
		return {
			...data,
			results,
		};
	},

	async get(id: number) {
		const user = await userRepository.get(id);
		if (!user) {
			throw new BusinessException('Usuário não encontrado', 404);
		}
		const { password, ...rest } = user;
		return rest;
	},

	async create(email: string, password: string) {
		const existingEmail = await this.findByEmail(email);
		if (existingEmail !== null) {
			throw new BusinessException('Já existe um usuário com este email', 400);
		}
		const passwordHash = await hashPassword(password);
		await userRepository.create(email, passwordHash);
		return successResponse('Usuário criado com sucesso', 201);
	},

	async update(id: number, dto: Partial<UpdateUserDto>) {
		const user = await this.get(id);
		if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
			const existingEmail = await this.findByEmail(dto.email);
			if (existingEmail) {
				throw new BusinessException('Já existe um usuário com este email', 400);
			}
		}
		if (dto.name && dto.name.toLowerCase() !== user.name?.toLowerCase()) {
			const existingEmail = await findByName(dto.name);
			if (existingEmail) {
				throw new BusinessException('Já existe um usuário com este nome', 400);
			}
		}
		if (dto.password) {
			dto.password = await hashPassword(dto.password);
		}
		const usersUpdated = await userRepository.update(user.id, dto);
		return usersUpdated.map((userUpdated) => {
			const { password, role, ...rest } = userUpdated;
			return rest;
		});
	},

	async remove(id: number) {
		const user = await this.get(id);
		if (user.role === 'admin') {
			throw new BusinessException('Usuário administrador não pode ser removido', 403);
		}
		await userRepository.delete(user.id);
		return successResponse('Usuário removido com sucesso', 200);
	},

	async findByEmail(email: string) {
		return await userRepository.findByEmail(email);
	},
};

const findByName = async (name: string) => {
	return await userRepository.findByName(name);
};

const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};
