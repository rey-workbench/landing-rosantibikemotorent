<script lang="ts">
	import { blogService } from '$lib/services';
	import { DEFAULTS } from '$lib/constants';
	import type { BlogTag } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { SeoHead } from '$lib/components/seo';
	import LL from '$i18n/i18n-svelte.js';
	import { optimizeImageUrl } from '$lib/utils/image';

	let { data } = $props();

	const lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	const currentUrl = $derived(page.url.href);

	let posts = $state<any[]>([]);
	let tags = $state<BlogTag[]>([]);
	let loading = $state(false);
	let error = $state('');
	let searchQuery = $state('');
	let selectedTagId = $state('');
	let currentPage = $state(1);
	let totalPages = $state(1);

	$effect(() => {
		posts = data.initialPosts || [];
		tags = data.tags || [];
		totalPages = data.initialMeta?.totalPages || 1;
	});

	async function loadPosts() {
		loading = true;
		error = '';

		try {
			const response = await blogService.getAll({
				page: currentPage,
				limit: DEFAULTS.BLOG_PAGE_SIZE,
				search: searchQuery,
				tagId: selectedTagId || undefined
			});

			posts = response.data || [];
			totalPages = response.meta?.totalPages || 1;
		} catch (err: any) {
			error = err?.response?.data?.userErrorMsg || err?.response?.data?.message || '';
		} finally {
			loading = false;
		}
	}

	function handleSearch() {
		currentPage = 1;
		loadPosts();
	}

	function selectTag(id: string) {
		selectedTagId = selectedTagId === id ? '' : id;
		currentPage = 1;
		loadPosts();
	}
</script>

<SeoHead
	{lang}
	meta={{
		title: `${$LL.page_title_blog()} | Rosantibike Motorent`,
		description: $LL.blog_subtitle(),
		ogType: 'website',
		canonicalUrl: currentUrl
	}}
/>

<main class="min-h-screen bg-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 md:px-10">
	<div class="max-w-7xl mx-auto">
		<!-- Compact Editorial Header -->
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-black/8">
			<div>
				<span class="text-[11px] font-semibold tracking-widest text-[#0071e3] uppercase mb-1.5 block">
					{$LL.blog_title()}
				</span>
				<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d1d1f] tracking-tight font-display">
					{$LL.blog_heading()} <span class="text-[#0071e3]">{$LL.blog_heading_highlight()}</span>
				</h1>
				<p class="text-xs sm:text-sm text-[#6b6b70] mt-1 max-w-xl">
					{$LL.blog_subtitle()}
				</p>
			</div>

			<!-- Quick Search Input (Compact Pill) -->
			<div class="w-full md:w-72 shrink-0">
				<div class="relative flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						class="absolute left-3.5 text-[#6b6b70]/60 pointer-events-none"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
					<input
						type="text"
						id="search-blog"
						bind:value={searchQuery}
						placeholder={$LL.blog_search_placeholder()}
						oninput={handleSearch}
						class="w-full h-9 pl-9 pr-4 bg-[#f5f5f7] border border-black/5 rounded-full text-xs text-[#1d1d1f] focus:outline-none transition-all"
					/>
				</div>
			</div>
		</div>

		<!-- Horizontal Category Filter Pills -->
		<div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-4 scrollbar-none border-b border-black/5 mb-8">
			<button
				onclick={() => selectTag('')}
				class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer {selectedTagId === ''
					? 'bg-[#1d1d1f] text-white shadow-sm'
					: 'bg-[#f5f5f7] text-[#6b6b70] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'}"
			>
				{$LL.blog_filter_all()}
			</button>
			{#each tags as tag}
				<button
					onclick={() => selectTag(tag.id)}
					class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer {selectedTagId === tag.id
						? 'bg-[#0071e3] text-white shadow-sm'
						: 'bg-[#f5f5f7] text-[#6b6b70] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'}"
				>
					{tag.nama}
				</button>
			{/each}
		</div>

		<!-- Articles Grid (Compact 3-Column Editorial Grid) -->
		{#if loading}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each Array(6) as _}
					<div class="animate-pulse flex flex-col gap-3">
						<div class="aspect-16/10 bg-[#f5f5f7] rounded-2xl"></div>
						<div class="h-4 bg-[#f5f5f7] rounded-full w-2/3"></div>
						<div class="h-3 bg-[#f5f5f7] rounded-full w-full"></div>
					</div>
				{/each}
			</div>
		{:else if error}
			<div class="text-center py-16 bg-[#f5f5f7] rounded-3xl border border-black/5 p-8 flex flex-col items-center justify-center">
				<h3 class="text-lg font-bold text-[#1d1d1f] mb-1">{$LL.blog_error_title()}</h3>
				<p class="text-xs text-[#6b6b70] mb-6">{error}</p>
				<Button onclick={loadPosts} variant="secondary" size="sm">
					{$LL.blog_try_again()}
				</Button>
			</div>
		{:else if posts.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
				{#each posts as post, i}
					<a
						href="/{lang}/blog/{post.slug}"
						class="group flex flex-col bg-white rounded-2xl border border-black/6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-black/12"
						in:fly={{ y: 15, duration: 400, delay: i * 40 }}
					>
						<!-- Image Container -->
						<div class="aspect-16/10 overflow-hidden bg-[#f5f5f7] relative">
							{#if post.featuredImage || post.thumbnail}
								<img
									loading={i < 3 ? 'eager' : 'lazy'}
									decoding="async"
									src={optimizeImageUrl(post.featuredImage || post.thumbnail, 600)}
									alt={post.judul}
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-[#6b6b70]/40">
									<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
										<circle cx="8.5" cy="8.5" r="1.5"></circle>
										<polyline points="21 15 16 10 5 21"></polyline>
									</svg>
								</div>
							{/if}

							<!-- Category Pill Badge -->
							{#if post.kategori}
								<div class="absolute top-3 left-3">
									<span class="px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-semibold text-[#1d1d1f] shadow-sm border border-black/5">
										{post.kategori.nama}
									</span>
								</div>
							{/if}
						</div>

						<!-- Card Body -->
						<div class="p-5 flex-1 flex flex-col justify-between">
							<div>
								<!-- Meta Subtitle -->
								<div class="flex items-center gap-2 text-[11px] text-[#6b6b70] mb-2 font-normal">
									{#if post.formattedDate && post.formattedDate !== '-'}
										<time datetime={post.createdAt}>{post.formattedDate}</time>
										<span class="w-1 h-1 rounded-full bg-black/20"></span>
									{/if}
									<span>{post.readingTime}</span>
								</div>

								<!-- Title -->
								<h2 class="text-[16px] sm:text-[17px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-tight font-display mb-2">
									{post.judul}
								</h2>

								<!-- Excerpt -->
								<p class="text-xs sm:text-[13px] text-[#6b6b70] line-clamp-2 leading-relaxed font-normal">
									{post.excerpt}
								</p>
							</div>

							<!-- Read Link -->
							<div class="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-medium text-[#0071e3]">
								<span>{$LL.blog_read_more()}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="transition-transform group-hover:translate-x-1"
								>
									<path d="M5 12h14M12 5l7 7-7 7" />
								</svg>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="text-center py-16 bg-[#f5f5f7] rounded-3xl border border-black/5 p-8 flex flex-col items-center justify-center">
				<h3 class="text-lg font-bold text-[#1d1d1f] mb-1">{$LL.blog_empty_title()}</h3>
				<p class="text-xs text-[#6b6b70] mb-6">{$LL.blog_empty_desc()}</p>
				<Button
					onclick={() => {
						searchQuery = '';
						selectedTagId = '';
						loadPosts();
					}}
					variant="primary"
					size="sm"
				>
					{$LL.blog_reset_filter()}
				</Button>
			</div>
		{/if}

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex justify-center items-center gap-3 mt-12">
				<button
					aria-label="Previous page"
					class="p-2.5 rounded-full bg-[#f5f5f7] border border-black/5 text-[#1d1d1f] disabled:opacity-30 hover:bg-[#e8e8ed] transition-all cursor-pointer"
					disabled={currentPage === 1}
					onclick={() => {
						currentPage--;
						loadPosts();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M15 18l-6-6 6-6" />
					</svg>
				</button>

				<div class="flex gap-1.5">
					{#each Array(totalPages) as _, i}
						<button
							onclick={() => {
								currentPage = i + 1;
								loadPosts();
							}}
							class="w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all cursor-pointer {currentPage === i + 1
								? 'bg-[#1d1d1f] text-white shadow-sm'
								: 'bg-[#f5f5f7] text-[#6b6b70] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'}"
						>
							{i + 1}
						</button>
					{/each}
				</div>

				<button
					aria-label="Next page"
					class="p-2.5 rounded-full bg-[#f5f5f7] border border-black/5 text-[#1d1d1f] disabled:opacity-30 hover:bg-[#e8e8ed] transition-all cursor-pointer"
					disabled={currentPage === totalPages}
					onclick={() => {
						currentPage++;
						loadPosts();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 18l6-6-6-6" />
					</svg>
				</button>
			</div>
		{/if}
	</div>
</main>

