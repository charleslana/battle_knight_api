import { authController } from '@/controllers/auth-controller';
import { authService } from '@/services/auth-service';
import { describe, expect, it, vi } from 'vitest';
import { log } from '@/shared/log-pino';
import { createExecutionContext } from 'cloudflare:test';

describe('Auth Controller - Unit Tests', () => {
	it('should authenticate user and return a token', async () => {
		// Mock o authService.authenticate
		const mockAuthenticate = vi.spyOn(authService, 'authenticate').mockResolvedValue({
			token: 'mock-token',
			userId: 9999,
		});

		// Mock o log
		const mockLog = vi.spyOn(log, 'info').mockImplementation(() => {});

		// Mock request
		const requestPayload = JSON.stringify({ email: 'email@email.com', password: 'password123' });
		const request = new Request('http://localhost:8787/', {
			method: 'POST',
			body: requestPayload,
			headers: {
				'Content-Type': 'application/json',
				// client_id: 'K3hNcVhBdzlYTU1PTU5KYXpJQXlrdnJwTjQzV2JBZVZp',
				// client_secret: 'X9pXZmMz4lV2JkYmZnQG93dJwzkLs28Rt9iDU3A6mZg',
			},
		});

		// Contexto vazio para simular o runtime
		const ctx = createExecutionContext();

		// Chama o handler do controller
		const response = await authController.fetch(request, {}, ctx);

		// Valida resposta
		expect(response.status).toBe(200);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({
			error: false,
			message: 'Autenticado com sucesso',
			token: 'mock-token',
			userId: 9999,
		});

		// Valida que o serviço e log foram chamados corretamente
		expect(mockAuthenticate).toHaveBeenCalledWith('email@email.com', 'password123');
		expect(mockLog).toHaveBeenCalledWith('REST: Login attempt', { email: 'email@email.com' });

		// Limpa os mocks
		mockAuthenticate.mockRestore();
		mockLog.mockRestore();
	});
});
