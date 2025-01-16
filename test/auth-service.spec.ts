import bcrypt from 'bcryptjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { authService } from '@/services/auth-service';
import { BusinessException } from '@/shared/BusinessException';
import { userService } from '@/services/user-service';

vi.mock('bcryptjs');
vi.mock('hono/jwt', () => ({
	sign: vi.fn().mockResolvedValue('mock-token'),
	verify: vi.fn(),
}));
vi.mock('@/services/user-service');
vi.mock('@/db/middleware', () => ({
	getContext: () => ({ env: { JWT_SECRET: 'test-secret' } }),
}));

describe('AuthService', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('authenticate', () => {
		it('should authenticate user and return a token', async () => {
			vi.spyOn(userService, 'findByEmail').mockResolvedValue([
				{
					id: 1,
					password: 'password123',
					role: 'user',
					email: 'email@email.com',
					name: null,
					exp: 0,
					level: 0,
					gold: 0,
					silver: 0,
					trophy: 0,
					createdAt: null,
					updatedAt: null,
				},
			]);
			vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
			vi.spyOn(authService, 'authenticate').mockResolvedValue({
				token: 'mock-token',
				userId: 1,
			});

			const result = await authService.authenticate('email@email.com', 'password123');
			expect(result).toEqual({ token: 'mock-token', userId: 1 });
		});

		it('should throw 404 if email not found', async () => {
			vi.spyOn(userService, 'findByEmail').mockResolvedValue(null);

			await expect(authService.authenticate('notfound@example.com', 'password123')).rejects.toThrow(
				new BusinessException('Credenciais não encontrada', 404)
			);
		});

		it('should throw 401 if password is incorrect', async () => {
			vi.spyOn(userService, 'findByEmail').mockResolvedValue([
				{
					id: 1,
					password: 'hashed-password',
					role: 'user',
					email: '',
					name: null,
					exp: 0,
					level: 0,
					gold: 0,
					silver: 0,
					trophy: 0,
					createdAt: null,
					updatedAt: null,
				},
			]);
			vi.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
			vi.spyOn(authService, 'authenticate').mockRejectedValue(
				new BusinessException('Credenciais inválidas', 401)
			);
			await expect(authService.authenticate('test@example.com', 'wrong-password')).rejects.toThrow(
				new BusinessException('Credenciais inválidas', 401)
			);
		});
	});

	describe('verifyToken', () => {
		it('should verify a valid token', async () => {
			vi.spyOn(authService, 'verifyToken').mockResolvedValue({ id: 1, role: 'user', exp: 123456 });
			const result = await authService.verifyToken('valid-token', 'test-secret');
			expect(result).toEqual({ id: 1, role: 'user', exp: 123456 });
		});

		it('should throw 401 for invalid or expired token', async () => {
			vi.spyOn(authService, 'verifyToken').mockRejectedValue(
				new BusinessException('Token inválido ou expirado', 401)
			);
			await expect(authService.verifyToken('invalid-token', 'test-secret')).rejects.toThrow(
				new BusinessException('Token inválido ou expirado', 401)
			);
		});
	});
});
