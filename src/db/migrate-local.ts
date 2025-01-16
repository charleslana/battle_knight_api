import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

config({
	path: '.dev.vars',
});

const pool = new Pool({
	connectionString: process.env.DATABASE_URL_LOCAL,
});

const db = drizzle(pool);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: 'drizzle',
		});
		console.log('Migration completed on local PostgreSQL');
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
};

main().then((r) => null);
