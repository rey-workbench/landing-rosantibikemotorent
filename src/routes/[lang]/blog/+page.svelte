<script lang="ts">
	import { blogApi } from '$lib/api';
	import type { BlogTag } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import { page } from '$app/stores';
	import { SeoHead } from '$lib/components/seo';

	let { data } = $props();

	const lang = $derived(($page.params.lang || 'id') as 'id' | 'en');
	const currentUrl = $derived($page.url.href);

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

	// Editorial layout mappings
	const featuredPost = $derived(
		currentPage === 1 && searchQuery === '' && selectedTagId === '' && posts.length > 0
			? posts[0]
			: null
	);
	const listPosts = $derived(
		currentPage === 1 && searchQuery === '' && selectedTagId === '' && posts.length > 1
			? posts.slice(1, 4)
			: []
	);
	const displayPosts = $derived(
		featuredPost && posts.length > 4
			? posts.slice(4) // Skip the featured + list items on page 1 with no filters
			: posts
	);

	async function loadPosts() {
		loading = true;
		error = '';

		try {
			const response = await blogApi.getAll({
				page: currentPage,
				limit: 9,
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

<!-- Hero Section -->
<section class="pt-32 pb-16 px-4 md:px-10">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h2
				class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center gap-2"
			>
				<span class="w-8 h-px bg-blue-500"></span>
				{$LL.blog_title()}
				<span class="w-8 h-px bg-blue-500"></span>
			</h2>
			<h1
				class="text-4xl md:text-6xl lg:text-7xl font-black text-brand-fg uppercase tracking-tighter leading-none"
			>
				{$LL.blog_heading()} <br />
				<span
					class="text-transparent bg-clip-text bg-linear-to-r from-brand-fg via-brand-fg to-brand-fg/50"
					>{$LL.blog_heading_highlight()}</span
				>
			</h1>
			<p class="text-brand-muted mt-6 max-w-xl text-lg">
				{$LL.blog_subtitle()}
			</p>
		</div>

		<!-- Filter Section -->
		<div class="relative z-20 glass-surface rounded-2xl p-6 mb-12 flex flex-col md:flex-row gap-6">
			<!-- Search -->
			<div class="flex-1">
				<Input
					id="search-blog"
					label={$LL.blog_search_label()}
					bind:value={searchQuery}
					placeholder={$LL.blog_search_placeholder()}
					icon="search"
					on:input={handleSearch}
				/>
			</div>

			<!-- Tags Filter -->
			<div class="flex-2 min-w-0">
				<label for="tag-filter" class="block text-sm text-brand-muted mb-2 uppercase tracking-wider"
					>{$LL.blog_filter_label()}</label
				>
				<div class="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none max-w-full">
					<button
						onclick={() => selectTag('')}
						class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer {selectedTagId ===
						''
							? 'bg-brand-fg text-brand-surface'
							: 'bg-brand-surface text-brand-fg border border-brand-border hover:border-gray-500'}"
					>
						{$LL.blog_filter_all()}
					</button>
					{#each tags as tag}
						<button
							onclick={() => selectTag(tag.id)}
							class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer {selectedTagId ===
							tag.id
								? 'bg-blue-600 text-white'
								: 'bg-brand-surface text-brand-fg border border-brand-border hover:border-gray-500'}"
						>
							{tag.nama}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Blog Content -->
		{#if loading}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each Array(6) as _}
					<div class="animate-pulse flex flex-col gap-4">
						<div class="aspect-16/10 bg-brand-surface rounded-3xl"></div>
						<div class="h-6 bg-brand-surface rounded-full w-3/4"></div>
						<div class="h-4 bg-brand-surface rounded-full w-full"></div>
					</div>
				{/each}
			</div>
		{:else if error}
			<div class="text-center py-20 glass-surface rounded-3xl flex flex-col items-center justify-center">
				<div class="mb-4 text-red-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="56"
						height="56"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
						<line x1="12" y1="9" x2="12" y2="13" />
						<line x1="12" y1="17" x2="12.01" y2="17" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-brand-fg mb-2">{$LL.blog_error_title()}</h3>
				<p class="text-brand-muted mb-8">{error}</p>
				<Button on:click={loadPosts} variant="secondary">{$LL.blog_try_again()}</Button>
			</div>
		{:else if posts.length > 0}
			<!-- Dwinawan-inspired Editorial Layout for Latest Stories (Page 1 only) -->
			{#if featuredPost}
				<div class="mb-16" in:fade={{ duration: 600 }}>
					<!-- Section Header -->
					<div class="mb-8 border-b border-brand-border/40 pb-4 flex justify-between items-center">
						<h3 class="font-display text-2xl uppercase tracking-wider text-brand-fg">
							Latest Stories
						</h3>
					</div>

					<!-- Split Layout -->
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
						<!-- Big Featured Card (Left Side) -->
						<div class="lg:col-span-7 flex flex-col">
							<a href="/{lang}/blog/{featuredPost.slug}" class="group block">
								<div class="aspect-16/10 rounded-3xl overflow-hidden bg-gray-800 relative mb-6">
									{#if featuredPost.featuredImage || featuredPost.thumbnail}
										<img
											src={featuredPost.featuredImage || featuredPost.thumbnail}
											alt={featuredPost.judul}
											class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
										/>
									{/if}
									<div class="absolute inset-0 bg-linear-to-t from-gray-900/60 via-transparent to-transparent"></div>
								</div>
								<div class="flex items-center gap-2 mb-3">
									{#if featuredPost.tags && featuredPost.tags.length > 0}
										<span class="text-xs font-black text-blue-500 uppercase tracking-widest">
											{featuredPost.tags[0].nama}
										</span>
									{/if}
									<span class="text-xs text-brand-muted/40 font-light">/</span>
									<span class="text-xs text-brand-muted">{featuredPost.readingTime}</span>
								</div>
								<h2 class="text-2xl md:text-3xl font-black text-brand-fg mb-4 group-hover:text-blue-500 transition-colors leading-tight">
									{featuredPost.judul}
								</h2>
								<p class="text-brand-muted text-sm leading-relaxed mb-4 line-clamp-3">
									{featuredPost.excerpt}
								</p>
								{#if featuredPost.formattedDate && featuredPost.formattedDate !== '-'}
									<span class="text-xs text-brand-muted font-semibold">{featuredPost.formattedDate}</span>
								{/if}
							</a>
						</div>

						<!-- Vertical Story List (Right Side) -->
						<div class="lg:col-span-5 flex flex-col gap-6 justify-between">
							{#each listPosts as post}
								<a href="/{lang}/blog/{post.slug}" class="group flex gap-5 items-center border-b border-brand-border/40 pb-6 last:border-0 last:pb-0">
									<div class="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gray-800 shrink-0 relative">
										{#if post.featuredImage || post.thumbnail}
											<img
												src={post.featuredImage || post.thumbnail}
												alt={post.judul}
												class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-1.5">
											{#if post.tags && post.tags.length > 0}
												<span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">{post.tags[0].nama}</span>
											{/if}
											<span class="text-[10px] text-brand-muted/40 font-light">/</span>
											<span class="text-[10px] text-brand-muted">{post.readingTime}</span>
										</div>
										<h3 class="text-sm md:text-base font-extrabold text-brand-fg group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
											{post.judul}
										</h3>
										{#if post.formattedDate && post.formattedDate !== '-'}
											<span class="text-[10px] text-brand-muted mt-2 block">{post.formattedDate}</span>
										{/if}
									</div>
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			{#if displayPosts.length > 0}
				<!-- Grid Title -->
				{#if featuredPost}
					<div class="mb-8 border-b border-brand-border/40 pb-4">
						<h3 class="font-display text-2xl uppercase tracking-wider text-brand-fg">
							More Stories
						</h3>
					</div>
				{/if}

				<!-- Blog Post Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each displayPosts as post, i}
						<a
							href="/{lang}/blog/{post.slug}"
							class="group glass-surface rounded-4xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-brand-highlight/20"
							in:fly={{ y: 20, duration: 600, delay: i * 50 }}
						>
							<!-- Image -->
							<div class="aspect-16/10 overflow-hidden bg-gray-800 relative">
								{#if post.featuredImage || post.thumbnail}
									<img
										src={post.featuredImage || post.thumbnail}
										alt={post.judul}
										class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center text-gray-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
											><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle
												cx="8.5"
												cy="8.5"
												r="1.5"
											></circle><polyline points="21 15 16 10 5 21"></polyline></svg
										>
									</div>
								{/if}
								<div
									class="absolute inset-0 bg-linear-to-t from-gray-950/70 via-transparent to-transparent"
								></div>

								<!-- Date & Reading Time Badge -->
								<div class="absolute bottom-4 left-4 right-4 flex justify-between items-center">
									{#if post.formattedDate && post.formattedDate !== '-'}
										<span
											class="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-wider"
										>
											{post.formattedDate}
										</span>
									{:else}
										<div></div>
									{/if}
									<span
										class="px-2.5 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-bold text-white/80 tracking-wide"
									>
										{post.readingTime}
									</span>
								</div>
							</div>

							<!-- Content -->
							<div class="p-6 flex-1 flex flex-col">
								<!-- Tags -->
								{#if post.tags && post.tags.length > 0}
									<div class="flex flex-wrap gap-2 mb-3">
										{#each post.tags.slice(0, 2) as tag}
											<span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">
												{tag.nama}
											</span>
										{/each}
									</div>
								{/if}

								<h3
									class="text-lg font-extrabold text-brand-fg mb-3 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug"
								>
									{post.judul}
								</h3>

								<p class="text-brand-muted text-xs md:text-sm mb-6 line-clamp-3 leading-relaxed">
									{post.excerpt}
								</p>

								<div
									class="mt-auto flex items-center gap-2 text-brand-fg font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all"
								>
									<span>{$LL.blog_read_more()}</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"
										></polyline></svg
									>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex justify-center items-center gap-4 mt-16">
					<button
						aria-label="Previous page"
						class="p-3 rounded-xl bg-brand-surface border border-brand-border text-brand-fg disabled:opacity-20 hover:border-blue-500 transition-all cursor-pointer"
						disabled={currentPage === 1}
						onclick={() => {
							currentPage--;
							loadPosts();
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"
							></polyline></svg
						>
					</button>

					<div class="flex gap-2">
						{#each Array(totalPages) as _, i}
							<button
								onclick={() => {
									currentPage = i + 1;
									loadPosts();
								}}
								class="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer {currentPage ===
								i + 1
									? 'bg-blue-600 text-white'
									: 'bg-brand-surface text-gray-500 border border-brand-border hover:border-blue-500 hover:text-blue-500'}"
							>
								{i + 1}
							</button>
						{/each}
					</div>

					<button
						aria-label="Next page"
						class="p-3 rounded-xl bg-brand-surface border border-brand-border text-brand-fg disabled:opacity-20 hover:border-blue-500 transition-all cursor-pointer"
						disabled={currentPage === totalPages}
						onclick={() => {
							currentPage++;
							loadPosts();
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"
							></polyline></svg
						>
					</button>
				</div>
			{/if}
		{:else}
			<div class="text-center py-20 glass-surface rounded-3xl flex flex-col items-center justify-center">
				<div class="mb-4 text-brand-muted">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="56"
						height="56"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
						<path d="M14 2v4a2 2 0 0 0 2 2h4" />
						<circle cx="11.5" cy="14.5" r="2.5" />
						<path d="M13.3 16.3 16 19" />
					</svg>
				</div>
				<h3 class="text-2xl font-bold text-brand-fg mb-2">{$LL.blog_empty_title()}</h3>
				<p class="text-brand-muted mb-8">{$LL.blog_empty_desc()}</p>
				<Button
					on:click={() => {
						searchQuery = '';
						selectedTagId = '';
						loadPosts();
					}}
					variant="secondary">{$LL.blog_reset_filter()}</Button
				>
			</div>
		{/if}
	</div>
</section>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
