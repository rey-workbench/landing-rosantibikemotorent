import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
		viteCompression({ algorithm: 'gzip', ext: '.gz' })
	],
	build: {
		cssCodeSplit: true,
		sourcemap: false,
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('svelte')) {
							return 'vendor-svelte';
						}
						if (id.includes('socket.io-client') || id.includes('libphonenumber-js')) {
							return 'vendor-heavy';
						}
						return 'vendor';
					}
				}
			}
		}
	},
	esbuild: {
		drop: ['console', 'debugger']
	}
});
