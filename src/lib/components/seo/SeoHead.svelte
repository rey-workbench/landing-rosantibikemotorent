<script lang="ts">
	import type { SeoMeta, SupportedLocale } from '$lib/seo/types';
	import { SITE_NAME, BASE_URL } from '$lib/seo/types';

	interface Props {
		meta: SeoMeta;
		lang?: SupportedLocale;
		schemas?: object[];
		path?: string;
	}

	let { meta, lang = 'id', schemas = [], path = '' }: Props = $props();

	const defaultTitle = `${SITE_NAME} - Premium Motorcycle Rental in Malang`;
	const defaultDescription =
		'Premium motorcycle rental service in Malang. Well-maintained units, 24/7 service, free delivery to stations, terminals, and hotels.';
	const defaultOgImage = `${BASE_URL}/video/posters/hero.webp`;

	const title = $derived(meta.title || defaultTitle);
	const description = $derived(meta.description || defaultDescription);
	const ogTitle = $derived(meta.ogTitle || meta.title || title);
	const ogDescription = $derived(meta.ogDescription || meta.description || description);
	const ogImage = $derived(meta.ogImage || defaultOgImage);
	const ogType = $derived(meta.ogType || 'website');
	const twitterCard = $derived(meta.twitterCard || 'summary_large_image');
	const robots = $derived(meta.robots || 'index, follow');

	const cleanPath = $derived(
		!path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
	);
	const currentUrl = $derived(meta.canonicalUrl || `${BASE_URL}/${lang}${cleanPath}`);
	const alternateUrls = $derived({
		id: `${BASE_URL}/id${cleanPath}`,
		en: `${BASE_URL}/en${cleanPath}`,
		xDefault: `${BASE_URL}/id${cleanPath}`
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={currentUrl} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content={lang === 'en' ? 'en_US' : 'id_ID'} />

	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={meta.twitterTitle || ogTitle} />
	<meta name="twitter:description" content={meta.twitterDescription || ogDescription} />
	<meta name="twitter:image" content={meta.twitterImage || ogImage} />

	<link rel="canonical" href={currentUrl} />
	<link rel="preload" as="image" href="/video/posters/hero.webp" fetchpriority="high" type="image/webp" />

	{#if meta.articlePublishedTime}
		<meta property="article:published_time" content={meta.articlePublishedTime} />
	{/if}

	<meta name="robots" content={robots} />

	<link rel="alternate" hreflang="id" href={alternateUrls.id} />
	<link rel="alternate" hreflang="en" href={alternateUrls.en} />
	<link rel="alternate" hreflang="x-default" href={alternateUrls.xDefault} />

	{#each schemas as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>
