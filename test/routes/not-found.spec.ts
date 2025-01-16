import app from '@/index';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createExecutionContext } from 'cloudflare:test';

describe('Rota Não Encontrada', () => {
	beforeAll(() => {
		vi.mock('@/middleware/client-auth-middleware', () => ({
			clientAuthMiddleware: vi.fn((c, next) => next()),
		}));
		vi.mock('@/db/middleware', () => ({
			dbMiddleware: vi.fn((c, next) => next()),
			contextMiddleware: vi.fn((c, next) => next()),
		}));
	});

	it('deve retornar mensagem de erro para rota inexistente', async () => {
		const request = new Request('http://localhost:8787/rota-invalida', {
			method: 'GET',
		});
		const ctx = createExecutionContext();
		const response = await app.fetch(request, {}, ctx);
		expect(response.status).toBe(404);
		const jsonResponse = await response.json();
		expect(jsonResponse).toEqual({
			error: true,
			message: 'Rota não encontrada',
		});
	});
});
