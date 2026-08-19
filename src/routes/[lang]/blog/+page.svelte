<script lang="ts">
	import { blogService } from '$lib/services';
	import { DEFAULTS } from '$lib/constants';
	import type { BlogTag } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade, fly } from 'svelte/transition';
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

	// Compact Editorial Layout Mappings
	const isDefaultView = $derived(
		currentPage === 1 && searchQuery === '' && selectedTagId === ''
	);
	const featuredPost = $derived(isDefaultView && posts.length > 0 ? posts[0] : null);
	const listPosts = $derived(isDefaultView && posts.length > 1 ? posts.slice(1, 4) : []);
	const morePosts = $derived(
		isDefaultView && posts.length > 4 ? posts.slice(4) : !isDefaultView ? posts : []
	);

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

<main class="bg-white min-h-screen">
	<!-- Hero / Header Section (Exact Fleet Style) -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-16 md:pt-20 pb-6">
		<div class="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 pb-6 border-b border-[#d2d2d7]">
			<div>
				<h1
					class="text-[40px] md:text-[48px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight"
				>
					{$LL.blog_heading()} {$LL.blog_heading_highlight()}
				</h1>
				<p class="text-[15px] text-[#6b6b70] font-normal mt-2 max-w-lg leading-relaxed">
					{$LL.blog_subtitle()}
				</p>
			</div>

			<!-- Search Input -->
			<div class="w-full md:w-72 shrink-0 mb-1">
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
						class="w-full h-9 pl-9 pr-4 bg-[#f5f5f7] border border-black/5 rounded-full text-xs text-[#1d1d1f] placeholder:text-[#6b6b70]/60 focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
					/>
				</div>
			</div>
		</div>

		<!-- Category Filter Strip -->
		<div class="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-4 scrollbar-none border-b border-black/5 mb-8">
			<button
				onclick={() => selectTag('')}
				class="px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer {selectedTagId === ''
					? 'bg-[#1d1d1f] text-white shadow-sm'
					: 'bg-[#f5f5f7] text-[#6b6b70] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'}"
			>
				{$LL.blog_filter_all()}
			</button>
			{#each tags as tag}
				<button
					onclick={() => selectTag(tag.id)}
					class="px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer {selectedTagId === tag.id
						? 'bg-[#0071e3] text-white shadow-sm'
						: 'bg-[#f5f5f7] text-[#6b6b70] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]'}"
				>
					{tag.nama}
				</button>
			{/each}
		</div>

		<!-- Blog Body Content -->
		{#if loading}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each Array(6) as _}
					<div class="animate-pulse flex flex-col gap-2.5">
						<div class="aspect-[16/10] bg-[#f5f5f7] rounded-xl"></div>
						<div class="h-3.5 bg-[#f5f5f7] rounded-full w-2/3"></div>
						<div class="h-2.5 bg-[#f5f5f7] rounded-full w-full"></div>
					</div>
				{/each}
			</div>
		{:else if error}
			<div class="text-center py-12 bg-[#f5f5f7] rounded-2xl border border-black/5 p-6 flex flex-col items-center justify-center">
				<h3 class="text-base font-bold text-[#1d1d1f] mb-1">{$LL.blog_error_title()}</h3>
				<p class="text-xs text-[#6b6b70] mb-4">{error}</p>
				<Button onclick={loadPosts} variant="secondary" size="sm">
					{$LL.blog_try_again()}
				</Button>
			</div>
		{:else if posts.length > 0}
			<!-- Featured Post Split Layout (Page 1 default view) -->
			{#if featuredPost}
				<div class="mb-10" in:fade={{ duration: 400 }}>
					<div class="mb-4 pb-2 border-b border-black/5 flex justify-between items-center">
						<h2 class="font-bold text-sm sm:text-base text-[#1d1d1f]">Cerita Utama</h2>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
						<!-- Big Featured Card (Left 7 Cols) -->
						<div class="lg:col-span-7 flex flex-col">
							<a href="/{lang}/blog/{featuredPost.slug}" class="group block">
								<div class="aspect-[16/10] rounded-2xl overflow-hidden bg-[#f5f5f7] relative mb-3.5 border border-black/5 shadow-sm">
									{#if featuredPost.featuredImage || featuredPost.thumbnail}
										<img
											loading="eager"
											fetchpriority="high"
											decoding="async"
											src={optimizeImageUrl(featuredPost.featuredImage || featuredPost.thumbnail, 800)}
											alt={featuredPost.judul}
											class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
										/>
									{/if}
									{#if featuredPost.kategori}
										<div class="absolute top-3 left-3">
											<span class="px-2.5 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-semibold text-[#1d1d1f] shadow-sm border border-black/5">
												{featuredPost.kategori.nama}
											</span>
										</div>
									{/if}
								</div>

								<div class="flex items-center gap-2 text-[11px] text-[#6b6b70] mb-1.5 font-normal">
									{#if featuredPost.formattedDate && featuredPost.formattedDate !== '-'}
										<time datetime={featuredPost.createdAt}>{featuredPost.formattedDate}</time>
										<span class="w-1 h-1 rounded-full bg-black/20"></span>
									{/if}
									<span>{featuredPost.readingTime}</span>
								</div>

								<h2 class="text-lg sm:text-xl font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-[1.25] font-display mb-1.5">
									{featuredPost.judul}
								</h2>

								<p class="text-xs sm:text-[13px] text-[#6b6b70] leading-relaxed line-clamp-2 font-normal mb-2">
									{featuredPost.excerpt}
								</p>

								<span class="text-xs font-semibold text-[#0071e3] inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
									{$LL.blog_read_more()} →
								</span>
							</a>
						</div>

						<!-- Vertical Story List (Right 5 Cols) -->
						<div class="lg:col-span-5 flex flex-col gap-3.5">
							{#each listPosts as post}
								<a
									href="/{lang}/blog/{post.slug}"
									class="group flex gap-3.5 items-center p-2.5 rounded-xl transition-all duration-200 hover:bg-[#f5f5f7] border border-transparent hover:border-black/5"
								>
									<div class="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-[#f5f5f7] shrink-0 border border-black/5 relative">
										{#if post.featuredImage || post.thumbnail}
											<img
												loading="lazy"
												decoding="async"
												src={optimizeImageUrl(post.featuredImage || post.thumbnail, 300)}
												alt={post.judul}
												class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 text-[10px] text-[#6b6b70] mb-1">
											{#if post.kategori}
												<span class="font-semibold text-[#0071e3] uppercase">{post.kategori.nama}</span>
												<span class="w-0.5 h-0.5 rounded-full bg-black/30"></span>
											{/if}
											<span>{post.readingTime}</span>
										</div>
										<h3 class="text-xs sm:text-[13px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug font-display">
											{post.judul}
										</h3>
										{#if post.formattedDate && post.formattedDate !== '-'}
											<span class="text-[10px] text-[#6b6b70] mt-1 block font-normal">
												{post.formattedDate}
											</span>
										{/if}
									</div>
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<!-- More Stories Grid (Compact 3 Columns) -->
			{#if morePosts.length > 0}
				<div class="mt-4">
					{#if featuredPost}
						<div class="mb-4 pb-2 border-b border-black/5">
							<h2 class="font-bold text-sm sm:text-base text-[#1d1d1f]">Artikel Lainnya</h2>
						</div>
					{/if}

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{#each morePosts as post, i}
							<a
								href="/{lang}/blog/{post.slug}"
								class="group flex flex-col bg-white rounded-xl border border-black/6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-black/12"
								in:fly={{ y: 15, duration: 400, delay: i * 30 }}
							>
								<!-- Image Container -->
								<div class="aspect-[16/10] overflow-hidden bg-[#f5f5f7] relative">
									{#if post.featuredImage || post.thumbnail}
										<img
											loading="lazy"
											decoding="async"
											src={optimizeImageUrl(post.featuredImage || post.thumbnail, 500)}
											alt={post.judul}
											class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
										/>
									{:else}
										<div class="w-full h-full flex items-center justify-center text-[#6b6b70]/40">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
												<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
												<circle cx="8.5" cy="8.5" r="1.5"></circle>
												<polyline points="21 15 16 10 5 21"></polyline>
											</svg>
										</div>
									{/if}

									{#if post.kategori}
										<div class="absolute top-2.5 left-2.5">
											<span class="px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-semibold text-[#1d1d1f] shadow-sm border border-black/5">
												{post.kategori.nama}
											</span>
										</div>
									{/if}
								</div>

								<!-- Card Body -->
								<div class="p-4 flex-1 flex flex-col justify-between">
									<div>
										<div class="flex items-center gap-1.5 text-[10px] text-[#6b6b70] mb-1.5 font-normal">
											{#if post.formattedDate && post.formattedDate !== '-'}
												<time datetime={post.createdAt}>{post.formattedDate}</time>
												<span class="w-0.5 h-0.5 rounded-full bg-black/20"></span>
											{/if}
											<span>{post.readingTime}</span>
										</div>

										<h2 class="text-sm sm:text-[15px] font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug font-display mb-1">
											{post.judul}
										</h2>

										<p class="text-[11px] sm:text-xs text-[#6b6b70] line-clamp-2 leading-relaxed font-normal">
											{post.excerpt}
										</p>
									</div>

									<div class="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] font-medium text-[#0071e3]">
										<span>{$LL.blog_read_more()}</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
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
				</div>
			{/if}
		{:else}
			<div class="text-center py-14 bg-[#f5f5f7] rounded-2xl border border-black/5 p-6 flex flex-col items-center justify-center">
				<h3 class="text-base font-bold text-[#1d1d1f] mb-1">{$LL.blog_empty_title()}</h3>
				<p class="text-xs text-[#6b6b70] mb-4">{$LL.blog_empty_desc()}</p>
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
	</section>
</main>

