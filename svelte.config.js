import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		alias: {
			$lib: 'src/lib',
			$i18n: 'src/i18n'
		},
		inlineStyleThreshold: 20480,
		adapter: adapter()
	}
};

export default config;
