<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import { SeoHead } from '$lib/components/seo';
	import { buildBreadcrumbSchema, buildArticleSchema } from '$lib/seo/schema';
	import { optimizeImageUrl } from '$lib/utils/image';
	import Button from '$lib/components/ui/Button.svelte';
	import { marked } from 'marked';
	import DOMPurify from 'isomorphic-dompurify';

	let { data } = $props();

	const post = $derived(data.post);
	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	const currentUrl = $derived(page.url.href);

	let copied = $state(false);

	const renderedHtml = $derived.by(() => {
		if (!post?.konten) return '';
		try {
			const rawParsed = marked.parse(post.konten, { async: false, breaks: true, gfm: true }) as string;
			const purify = (DOMPurify as any)?.default || DOMPurify;
			return typeof purify?.sanitize === 'function' ? purify.sanitize(rawParsed) : rawParsed;
		} catch (e) {
			return post.konten;
		}
	});

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
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
</script>

{#if post}
	<SeoHead
		{lang}
		meta={{
			title: `${post.metaTitle || post.judul} | Rosantibike Editorial`,
			description: post.metaDescription || post.judul,
			ogType: 'article',
			ogImage: post.featuredImage || post.thumbnail,
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
	<main class="min-h-screen bg-white">
		<!-- Article Header (Medium / Apple Editorial Style) -->
		<header class="pt-28 md:pt-36 pb-10 px-4 sm:px-6 md:px-8">
			<div class="max-w-185 mx-auto">
				<!-- Navigation Back Link -->
				<div class="mb-8">
					<a
						href="/{lang}/blog"
						class="inline-flex items-center gap-2 text-[#0071e3] text-sm font-medium hover:underline transition-all group"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							class="transition-transform group-hover:-translate-x-1"
						>
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
						{$LL.blog_back_to_journal()}
					</a>
				</div>

				<!-- Categories & Badges -->
				<div class="flex flex-wrap items-center gap-2 mb-5">
					{#if post.kategori}
						<span
							class="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] text-[11px] font-semibold tracking-wider uppercase rounded-full border border-black/5"
						>
							{post.kategori.nama}
						</span>
					{/if}
					{#if post.tags}
						{#each post.tags as tag}
							<span
								class="px-2.5 py-0.5 text-[#6b6b70] text-[11px] font-medium rounded-full"
							>
								#{tag.nama}
							</span>
						{/each}
					{/if}
				</div>

				<!-- Article Headline (Apple Editorial) -->
				<h1
					class="text-[32px] sm:text-[44px] md:text-[52px] font-bold text-[#1d1d1f] leading-[1.12] tracking-tight mb-6 font-display"
				>
					{post.judul}
				</h1>

				<!-- Author & Meta Bar (Medium Style) -->
				<div class="flex items-center justify-between gap-4 py-5 border-y border-black/8">
					<div class="flex items-center gap-3.5">
						<div
							class="w-11 h-11 rounded-full bg-linear-to-br from-[#0071e3] to-[#004f9e] text-white flex items-center justify-center font-bold text-sm shadow-sm"
						>
							R
						</div>
						<div class="flex flex-col text-left">
							<div class="flex items-center gap-2">
								<span class="text-sm font-semibold text-[#1d1d1f]">Rosantibike Editorial</span>
								<span class="inline-block w-1 h-1 rounded-full bg-black/30"></span>
								<span class="text-xs text-[#0071e3] font-medium">Verified</span>
							</div>
							<div class="flex items-center gap-2 text-xs text-[#6b6b70] mt-0.5">
								{#if post.formattedDate && post.formattedDate !== '-'}
									<time datetime={post.createdAt}>{post.formattedDate}</time>
									<span class="inline-block w-1 h-1 rounded-full bg-black/20"></span>
								{/if}
								<span>{post.readingTime}</span>
							</div>
						</div>
					</div>

					<!-- Quick Actions (Copy & Share) -->
					<div class="flex items-center gap-2">
						<a
							href="https://wa.me/?text={encodeURIComponent(post.judul + ' - ' + getCurrentUrl())}"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Share WhatsApp"
							class="w-9 h-9 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center transition-all cursor-pointer"
							title="Bagikan ke WhatsApp"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
							</svg>
						</a>
						<button
							onclick={copyLink}
							aria-label="Salin Link"
							class="h-9 px-3.5 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
							title="Salin Tautan Artikel"
						>
							{#if copied}
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5">
									<polyline points="20 6 9 17 4 12" />
								</svg>
								<span class="text-[#0071e3]">Disalin</span>
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
								</svg>
								<span>Salin</span>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Content & Body Section -->
		<article class="pb-28 px-4 sm:px-6 md:px-8">
			<div class="max-w-185 mx-auto">
				<!-- Hero Featured Image -->
				{#if post.featuredImage || post.thumbnail}
					<div
						class="mb-14 rounded-3xl overflow-hidden aspect-16/10g-[#f5f5f7] border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
						in:fade={{ duration: 600 }}
					>
						<img
							loading="eager"
							fetchpriority="high"
							decoding="async"
							src={optimizeImageUrl(post.featuredImage || post.thumbnail, 1200)}
							alt={post.judul}
							class="w-full h-full object-cover"
						/>
					</div>
				{/if}

				<!-- Article Rich Markdown Prose Content -->
				<div class="article-content font-sans">
					{@html renderedHtml}
				</div>

				<!-- Article Footnote / Divider -->
				<div class="my-16 flex items-center justify-center gap-2 text-black/20">
					<span class="w-1.5 h-1.5 rounded-full bg-black/20"></span>
					<span class="w-1.5 h-1.5 rounded-full bg-black/20"></span>
					<span class="w-1.5 h-1.5 rounded-full bg-black/20"></span>
				</div>

				<!-- Bottom Callout & Booking Banner (Apple Card Style) -->
				<div
					class="p-8 sm:p-10 bg-[#f5f5f7] rounded-3xl border border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
				>
					<div class="text-center md:text-left space-y-1.5">
						<h3 class="text-lg sm:text-xl font-bold text-[#1d1d1f] font-display">
							Siap Menjelajahi Kota Bersama Rosantibike?
						</h3>
						<p class="text-sm text-[#6b6b70] max-w-md">
							Pesan unit motor atau sepeda elektrik impian Anda sekarang dengan proses online cepat dan unit prima.
						</p>
					</div>
					<div class="shrink-0">
						<Button href="/{lang}/booking" variant="primary" size="md">
							{$LL.blog_rent_now()}
						</Button>
					</div>
				</div>
			</div>
		</article>
	</main>
{/if}


