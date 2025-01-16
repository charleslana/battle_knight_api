import { describe, expect, it } from 'vitest';
import { generateNumber, generateToken, validateEmail, validateName } from '@/utils/utils';

describe('Utils - Unit Tests', () => {
	describe('generateToken', () => {
		it('deve gerar um token único e válido', () => {
			const token = generateToken();
			expect(token).toBeDefined();
			expect(typeof token).toBe('string');
			expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
		});

		it('deve gerar tokens diferentes em chamadas consecutivas', () => {
			const token1 = generateToken();
			const token2 = generateToken();
			expect(token1).not.toBe(token2);
		});
	});

	describe('generateNumber', () => {
		it('deve gerar um número entre 0 e 9.999.999.999', () => {
			const number = generateNumber();
			expect(number).toBeGreaterThanOrEqual(0);
			expect(number).toBeLessThan(10_000_000_000);
		});

		it('deve gerar números diferentes em chamadas consecutivas', () => {
			const number1 = generateNumber();
			const number2 = generateNumber();
			expect(number1).not.toBe(number2);
		});
	});

	describe('validateEmail', () => {
		it('deve validar e-mails corretos', () => {
			expect(validateEmail('test@example.com')).toBe(true);
			expect(validateEmail('user.name+tag+sorting@example.com')).toBe(true);
		});

		it('deve retornar falso para e-mails inválidos', () => {
			expect(validateEmail('invalid-email')).toBe(false);
			expect(validateEmail('user@@example.com')).toBe(false);
			expect(validateEmail('user@.com')).toBe(false);
		});
	});

	describe('validateName', () => {
		it('deve validar nomes corretos', () => {
			expect(validateName('João Silva')).toBe(true);
			expect(validateName('Marie Curie')).toBe(true);
			expect(validateName('孙悟空')).toBe(true);
		});

		it('deve retornar falso para nomes inválidos', () => {
			expect(validateName('John@Doe')).toBe(false);
			expect(validateName('')).toBe(false);
			expect(validateName('1234#')).toBe(false);
		});
	});
});
