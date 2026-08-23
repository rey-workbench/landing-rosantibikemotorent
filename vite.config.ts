import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
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
			external: ['canvas', 'bufferutil', 'utf-8-validate'],
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('isomorphic-dompurify')) {
							return 'dompurify';
						}
						if (id.includes('socket.io-client') || id.includes('libphonenumber-js')) {
							return 'vendor-heavy';
						}
					}
				}
			}
		}
	},
	esbuild: {
		drop: ['console', 'debugger']
	}
});
