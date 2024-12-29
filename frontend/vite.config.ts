import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages} from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { env } from '$env/dynamic/private';

const vitestPath = env.VITE_VITEST;

export default defineConfig({
	plugins: [sveltekit(), enhancedImages()],
	define: {
		'import.meta.env.VITE_VITEST': JSON.stringify(vitestPath),
	}
});
