import { defineConfig } from 'vitest/config';
import  { loadEnv } from 'vite';


export default defineConfig(({ mode}) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		test: {
			environment: 'jsdom',
			setupFiles: ['./vitest.setup.ts'],
			globals: true,
      exclude: ['**/node_modules/**'],
		},
		define: {
			'import.meta.env.VITE_VITEST': JSON.stringify(env.VITE_VITEST),
		}
	}

})