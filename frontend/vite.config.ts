import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [sveltekit(), enhancedImages(), tailwindcss()],
	server: {
		fs: {
			allow: ['.well-known']
		}
	}
});
