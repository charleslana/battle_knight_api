import tsconfigPaths from 'vite-tsconfig-paths';
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		coverage: {
			provider: 'istanbul',
			reporter: ['text', 'html'],
			reportsDirectory: './coverage',
		},
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
	plugins: [tsconfigPaths()],
});
