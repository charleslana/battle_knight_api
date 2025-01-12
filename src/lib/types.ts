import type { Database } from '@/db/middleware';

export type Env = {
	DATABASE_URL: string;
	DATABASE_URL_LOCAL: string;
	NODE_ENV: string;
	CLIENT_ID: string;
	CLIENT_SECRET: string;
};

export type Variables = {
	db: Database;
};
