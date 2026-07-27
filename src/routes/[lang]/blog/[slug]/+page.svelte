<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import { SeoHead } from '$lib/components/seo';
	import { buildBreadcrumbSchema, buildArticleSchema } from '$lib/seo/schema';

	let { data } = $props();

	const post = $derived(data.post);
	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	const currentUrl = $derived(page.url.href);

	const breadcrumbSchema = $derived(
		post
			? buildBreadcrumbSchema([
					{ position: 1, name: 'Home', item: `https://rosantibikemotorent.com/${lang}` },
					{ position: 2, name: 'Blog', item: `https://rosantibikemotorent.com/${lang}/blog` },
					{ position: 3, name: post.judul || '', item: currentUrl }
				])
			: null
	);

	const articleSchema = $derived(
		post
			? buildArticleSchema({
					title: post.judul,
					description: post.metaDescription || post.judul,
					image: post.featuredImage || post.thumbnail,
					publishedTime: post.createdAt,
					url: currentUrl
				})
			: null
	);

	const schemas = $derived([breadcrumbSchema, articleSchema].filter(Boolean) as object[]);

	function getCurrentUrl(): string {
		if (browser) {
			return window.location.href;
		}
		return '';
	}

	function copyLink() {
		if (browser) {
			navigator.clipboard.writeText(window.location.href);
		}
	}
</script>

{#if post}
	<SeoHead
		{lang}
		meta={{
			title: `${post.metaTitle || post.judul} | Rosantibike Journal`,
			description: post.metaDescription || post.judul,
			ogType: 'article',
			ogImage: post.featuredImage,
			canonicalUrl: getCurrentUrl(),
			articlePublishedTime: post.createdAt
		}}
		{schemas}
	/>
{:else}
	<SeoHead
		{lang}
		meta={{
			title: `${$LL.blog_title()} | Rosantibike Motorent`
		}}
	/>
{/if}

{#if post}
	<!-- Header Section -->
	<header class="relative pt-28 md:pt-32 pb-16 px-4 md:px-10">
		<div class="max-w-3xl mx-auto text-center">
			<!-- Back Button -->
			<div class="mb-10 text-left">
				<a
					href="/{lang}/blog"
					class="inline-flex items-center gap-2 text-[#0071e3] text-[13px] font-medium transition-colors hover:underline"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
					{$LL.blog_back_to_journal().replace(/^[←\s\-]+/g, '')}
				</a>
			</div>

			<!-- Categories & Tags -->
			<div class="flex flex-wrap justify-center gap-2 mb-6">
				{#if post.kategori}
					<span
						class="px-3.5 py-1 bg-white text-[#1d1d1f] text-[11px] font-semibold tracking-wider rounded-full border border-black/5 shadow-sm"
					>
						{post.kategori.nama}
					</span>
				{/if}
				{#if post.tags}
					{#each post.tags as tag}
						<span
							class="px-3.5 py-1 bg-[#f5f5f7] border border-black/5 text-[#86868b] text-[11px] font-semibold tracking-wider rounded-full"
						>
							#{tag.nama}
						</span>
					{/each}
				{/if}
			</div>

			<!-- Title -->
			<h1
				class="text-[40px] md:text-[56px] font-semibold text-[#1d1d1f] leading-[1.05] tracking-tight mb-8"
			>
				{post.judul}
			</h1>

			<!-- Meta Data with Author Avatar -->
			<div class="flex items-center justify-center gap-4 border-t border-b border-black/5 py-5">
				<div
					class="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] font-semibold text-sm"
				>
					R
				</div>
				<div class="flex flex-col text-left">
					<span class="text-[13px] font-medium text-[#1d1d1f]">Rosantibike Team</span>
					<div class="flex items-center gap-2 text-[12px] text-[#86868b] font-normal mt-0.5">
						{#if post.formattedDate && post.formattedDate !== '-'}
							<time datetime={post.createdAt}>{post.formattedDate}</time>
							<span class="text-[#86868b]/40 font-light">|</span>
						{/if}
						<span>{post.readingTime}</span>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Content Section -->
	<article class="pb-32 px-4 md:px-10">
		<div class="max-w-3xl mx-auto">
			<!-- Featured Hero Image -->
			{#if post.featuredImage || post.thumbnail}
				<div
					class="mb-16 rounded-3xl overflow-hidden aspect-video border border-black/5"
					in:fade={{ duration: 800 }}
				>
					<img
						loading="lazy"
						decoding="async"
						src={post.featuredImage || post.thumbnail}
						alt={post.judul}
						class="w-full h-full object-cover"
					/>
				</div>
			{/if}

			<!-- Article Body Content -->
			<div class="prose max-w-none article-content">
				{#await import('isomorphic-dompurify') then DOMPurify}
					{@html DOMPurify.default.sanitize(post.konten)}
				{/await}
			</div>

			<!-- Share & CTA Footer Box -->
			<div
				class="mt-20 p-8 bg-[#f5f5f7] rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 border border-black/5"
			>
				<div class="text-center md:text-left">
					<h3 class="text-[13px] font-semibold text-[#86868b] tracking-wide mb-3">
						{$LL.blog_share()}
					</h3>
					<div class="flex justify-center md:justify-start gap-3">
						<a
							href="https://wa.me/?text={encodeURIComponent(post.judul + ' - ' + getCurrentUrl())}"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Share on WhatsApp"
							class="w-10 h-10 bg-white border border-black/5 rounded-full flex items-center justify-center hover:bg-[#1d1d1f] hover:text-white hover:border-[#1d1d1f] shadow-sm transition-all cursor-pointer text-[#1d1d1f]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
								><path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
								/></svg
							>
						</a>
						<button
							onclick={copyLink}
							aria-label="Copy link"
							class="w-10 h-10 bg-white border border-black/5 rounded-full flex items-center justify-center hover:bg-[#1d1d1f] hover:text-white hover:border-[#1d1d1f] shadow-sm transition-all cursor-pointer text-[#1d1d1f]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path
									d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
								></path></svg
							>
						</button>
					</div>
				</div>

				<div class="flex items-center shrink-0">
					<a
						href="/{lang}/booking"
						class="px-6 py-3 bg-[#0071e3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ed] transition-colors shadow-sm"
					>
						{$LL.blog_rent_now()}
					</a>
				</div>
			</div>
		</div>
	</article>
{/if}

<style>
	.article-content {
		color: #1d1d1f;
		line-height: 1.6;
		font-size: 1.125rem;
	}

	/* Minimalist Dropcap */
	.article-content :global(p:first-of-type::first-letter) {
		float: left;
		font-size: 3.5rem;
		line-height: 0.8;
		padding-top: 8px;
		padding-right: 8px;
		font-weight: 600;
		color: #1d1d1f;
	}

	:global(.article-content h1),
	:global(.article-content h2),
	:global(.article-content h3),
	:global(.article-content h4),
	:global(.article-content strong) {
		color: #1d1d1f !important;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	:global(.article-content h2) {
		font-size: 2rem;
		margin: 3rem 0 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		padding-bottom: 0.5rem;
	}

	:global(.article-content h3) {
		font-size: 1.5rem;
		margin: 2rem 0 1rem;
	}

	:global(.article-content p) {
		margin-bottom: 1.5rem;
		color: #1d1d1f;
	}

	:global(.article-content a) {
		color: #0071e3 !important;
		text-decoration: underline;
	}

	:global(.article-content a:hover) {
		text-decoration: none;
	}

	:global(.article-content img) {
		border-radius: 1.5rem;
		margin: 3rem 0;
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	:global(.article-content blockquote) {
		border-left: 3px solid #1d1d1f;
		padding: 1rem 1.5rem;
		background: #f5f5f7;
		border-radius: 0 1rem 1rem 0;
		margin: 2.5rem 0;
		color: #1d1d1f;
	}
</style>
