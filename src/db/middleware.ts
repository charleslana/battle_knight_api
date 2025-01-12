import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePool } from 'drizzle-orm/node-postgres';
import { Env, Variables } from '@/lib/types';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import type { Context, MiddlewareHandler } from 'hono';

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
		return drizzlePool({ client: pool });
	}
	const sql = neon(c.env.DATABASE_URL);
	return drizzle({ client: sql });
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
