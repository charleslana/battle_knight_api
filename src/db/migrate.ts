import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

config({
	path: '.dev.vars',
});

console.log(process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: 'drizzle',
		});
		console.log('Migrated successful.');
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main().then((r) => null);
