import * as schema from './schema';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePool } from 'drizzle-orm/node-postgres';
import { Env, Variables } from '@/lib/types';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import type { Context, MiddlewareHandler } from 'hono';

let currentContext: Context | null = null;

export const contextMiddleware: MiddlewareHandler = async (c, next) => {
	currentContext = c;
	await next();
	currentContext = null;
};

function createDb(
	c: Context<{
		Bindings: Env;
		Variables: Variables;
	}>,
	env: string
) {
	if (env === 'dev') {
		const pool = new Pool({
			connectionString: c.env.DATABASE_URL_LOCAL,
		});
		return drizzlePool({ client: pool, schema });
	}
	const sql = neon(c.env.DATABASE_URL);
	return drizzle({ client: sql, schema });
}

export type Database = ReturnType<typeof createDb>;

export const dbMiddleware: MiddlewareHandler = async (
	c: Context<{
		Bindings: Env;
		Variables: Variables;
	}>,
	next
) => {
	const env = c.env.NODE_ENV || 'prod';
	const db = createDb(c, env);
	c.set('db', db);
	await next();
};

export function getDb(): Database {
	const context = getContext();
	const db = context.get('db');
	if (!db) {
		throw new Error('Database instance not found in context. Did you forget to use dbMiddleware?');
	}
	return db;
}

export function getContext(): Context<{
	Bindings: Env;
	Variables: Variables;
}> {
	if (!currentContext) {
		throw new Error('Context is not set. Did you forget to use contextMiddleware?');
	}
	return currentContext;
}
