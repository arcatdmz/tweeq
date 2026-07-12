import {defineConfig} from '@playwright/test'

/**
 * Run via `npm run e2e` — it sets LD_LIBRARY_PATH for the locally-extracted
 * chromium system libs (see docs/react-port/PLAN.md, "E2E" row).
 */
export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	retries: 0,
	use: {
		baseURL: 'http://localhost:5174',
	},
	webServer: {
		command: 'npx vite serve demo --port 5174 --strictPort',
		url: 'http://localhost:5174',
		reuseExistingServer: true,
		stdout: 'ignore',
	},
})
