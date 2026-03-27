<script lang="ts">
	import { blogApi } from '$lib/api';
	import type { BlogTag } from '$lib/types';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import { page } from '$app/stores';

	export let data;

	$: lang = $page.params.lang || 'id';

	let posts: any[] = data.initialPosts;
	let tags: BlogTag[] = data.tags;
	let loading = false;
	let error = '';
	let searchQuery = '';
	let selectedTagId = '';
	let currentPage = 1;
	let totalPages = data.initialMeta?.totalPages || 1;

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

			// Pre-process for new posts
			posts = (response.data || []).map((post: any) => ({
				...post,
				excerpt: post.konten ? post.konten.replace(/<[^>]*>/g, '').substring(0, 120) + '...' : '',
				formattedDate: new Date(post.createdAt).toLocaleDateString('id-ID', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			}));
			totalPages = response.meta?.totalPages || 1;
		} catch (err) {
			error = err instanceof Error ? err.message : $LL.blog_error_title();
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

<svelte:head>
	<title>{$LL.page_title_blog()} | Rosantibike Motorent</title>
	<meta name="description" content={$LL.blog_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<section class="pt-32 pb-16 px-4 md:px-10">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<h2
				class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center gap-2"
			>
				<span class="w-8 h-[1px] bg-blue-500"></span>
				{$LL.blog_title()}
				<span class="w-8 h-[1px] bg-blue-500"></span>
			</h2>
			<h1
				class="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none"
			>
				{$LL.blog_heading()} <br />
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600"
					>{$LL.blog_heading_highlight()}</span
				>
			</h1>
			<p class="text-gray-400 mt-6 max-w-xl text-lg">
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
			<div class="flex-[2]">
				<label for="tag-filter" class="block text-sm text-gray-400 mb-2 uppercase tracking-wider"
					>{$LL.blog_filter_label()}</label
				>
				<div class="flex flex-wrap gap-2">
					<button
						on:click={() => selectTag('')}
						class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all {selectedTagId ===
						''
							? 'bg-white text-black'
							: 'bg-brand-surface text-gray-400 border border-brand-border hover:border-gray-500'}"
					>
						{$LL.blog_filter_all()}
					</button>
					{#each tags as tag}
						<button
							on:click={() => selectTag(tag.id)}
							class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all {selectedTagId ===
							tag.id
								? 'bg-blue-600 text-white'
								: 'bg-brand-surface text-gray-400 border border-brand-border hover:border-gray-500'}"
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
						<div class="aspect-[16/10] bg-brand-surface rounded-3xl"></div>
						<div class="h-6 bg-brand-surface rounded-full w-3/4"></div>
						<div class="h-4 bg-brand-surface rounded-full w-full"></div>
					</div>
				{/each}
			</div>
		{:else if error}
			<div class="text-center py-20 glass-surface rounded-3xl">
				<div class="text-6xl mb-4">⚠️</div>
				<h3 class="text-2xl font-bold text-white mb-2">{$LL.blog_error_title()}</h3>
				<p class="text-gray-400 mb-8">{error}</p>
				<Button on:click={loadPosts} variant="secondary">{$LL.blog_try_again()}</Button>
			</div>
		{:else if posts.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each posts as post, i}
					<a
						href="/{lang}/blog/{post.slug}"
						class="group glass-surface rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2"
						in:fly={{ y: 20, duration: 600, delay: i * 50 }}
					>
						<!-- Image -->
						<div class="aspect-[16/10] overflow-hidden bg-gray-800 relative">
							{#if post.featuredImage || post.thumbnail}
								<img
									src={post.featuredImage || post.thumbnail}
									alt={post.judul}
									class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-600">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1"
										><rect x="3" y="3" width="18" height="18" rx="2" /><circle
											cx="8.5"
											cy="8.5"
											r="1.5"
										/><path d="m21 15-5-5L5 21" /></svg
									>
								</div>
							{/if}
							<div
								class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"
							></div>

							<!-- Date Badge -->
							<div class="absolute bottom-4 left-4">
								<span
									class="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
								>
									{post.formattedDate}
								</span>
							</div>
						</div>

						<!-- Content -->
						<div class="p-6 flex-1 flex flex-col">
							<!-- Tags -->
							{#if post.tags && post.tags.length > 0}
								<div class="flex flex-wrap gap-2 mb-4">
									{#each post.tags.slice(0, 2) as tag}
										<span class="text-[9px] font-bold uppercase tracking-wider text-blue-400">
											#{tag.nama}
										</span>
									{/each}
								</div>
							{/if}

							<h3
								class="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2"
							>
								{post.judul}
							</h3>

							<p class="text-gray-400 text-sm mb-8 line-clamp-3">
								{post.excerpt}
							</p>

							<div
								class="mt-auto flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
							>
								<span>{$LL.blog_read_more()}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
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

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex justify-center items-center gap-4 mt-16">
					<button
						aria-label="Previous page"
						class="p-3 rounded-xl bg-brand-surface border border-brand-border text-white disabled:opacity-20 hover:border-gray-500 transition-all"
						disabled={currentPage === 1}
						on:click={() => {
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
								on:click={() => {
									currentPage = i + 1;
									loadPosts();
								}}
								class="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all {currentPage ===
								i + 1
									? 'bg-white text-black'
									: 'bg-brand-surface text-gray-500 border border-brand-border hover:border-gray-500'}"
							>
								{i + 1}
							</button>
						{/each}
					</div>

					<button
						aria-label="Next page"
						class="p-3 rounded-xl bg-brand-surface border border-brand-border text-white disabled:opacity-20 hover:border-gray-500 transition-all"
						disabled={currentPage === totalPages}
						on:click={() => {
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
			<div class="text-center py-20 glass-surface rounded-3xl">
				<div class="text-6xl mb-4">🔍</div>
				<h3 class="text-2xl font-bold text-white mb-2">{$LL.blog_empty_title()}</h3>
				<p class="text-gray-400 mb-8">{$LL.blog_empty_desc()}</p>
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
