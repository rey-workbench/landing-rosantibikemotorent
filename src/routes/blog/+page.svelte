<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { blogApi } from '$lib/api';
	import type { BlogPost, BlogTag } from '$lib/types';

	let posts: BlogPost[] = [];
	let tags: BlogTag[] = [];
	let loading = true;
	let error = '';
	let searchQuery = '';
	let currentPage = 1;
	let totalPages = 1;

	onMount(async () => {
		await loadPosts();
	});

	async function loadPosts() {
		loading = true;
		error = '';

		try {
			const [postsResponse, tagsResponse] = await Promise.all([
				blogApi.getAll({ page: currentPage, limit: 9, search: searchQuery }),
				blogApi.getTags()
			]);

			posts = postsResponse.data || [];
			tags = tagsResponse || [];
			totalPages = postsResponse.meta?.totalPages || 1;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat artikel';
		} finally {
			loading = false;
		}
	}

	function handleSearch() {
		currentPage = 1;
		loadPosts();
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function stripHtml(html: string): string {
		return html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
	}
</script>

<svelte:head>
	<title>Blog - Rosantibike Motorent</title>
	<meta
		name="description"
		content="Baca artikel terbaru seputar tips berkendara, destinasi wisata Malang, dan berita seputar motor dari Rosantibike Motorent."
	/>
</svelte:head>

<div class="min-h-screen bg-brand-dark text-white">
	<Navbar />

	<section class="pt-32 pb-20 px-4 md:px-10">
		<div class="max-w-6xl mx-auto">
			<!-- Header -->
			<div class="mb-12">
				<h2
					class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center gap-2"
				>
					<span class="w-8 h-[1px] bg-blue-500"></span>
					Blog
				</h2>
				<h1
					class="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none"
				>
					Cerita & <br />
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600"
						>Inspirasi.</span
					>
				</h1>
				<p class="text-gray-400 mt-6 max-w-xl text-lg">
					Tips berkendara, rekomendasi destinasi, dan info terbaru seputar motor dan petualangan di
					Malang.
				</p>
			</div>

			<!-- Search -->
			<div class="flex flex-col md:flex-row gap-4 mb-12">
				<form on:submit|preventDefault={handleSearch} class="flex-1">
					<div class="relative">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Cari artikel..."
							class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
					</div>
				</form>

				<!-- Tags -->
				{#if tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each tags.slice(0, 5) as tag}
							<span class="px-4 py-2 bg-white/5 text-gray-400 rounded-full text-sm">
								{tag.nama}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Loading State -->
			{#if loading}
				<div class="flex justify-center py-20">
					<div
						class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
					></div>
				</div>
			{:else if error}
				<div class="text-center py-20">
					<div class="text-6xl mb-4">⚠️</div>
					<h3 class="text-2xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
					<p class="text-gray-400">{error}</p>
				</div>
			{:else if posts.length > 0}
				<!-- Blog Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each posts as post}
						<a
							href="/blog/{post.slug}"
							class="group bg-gray-900 rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
						>
							<!-- Image -->
							<div class="aspect-[16/10] overflow-hidden bg-gray-800">
								{#if post.featuredImage || post.thumbnail}
									<img
										src={post.featuredImage || post.thumbnail}
										alt={post.judul}
										class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
								{:else}
									<div
										class="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-gray-800 to-gray-900"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="48"
											height="48"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1"
										>
											<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
										</svg>
									</div>
								{/if}
							</div>

							<!-- Content -->
							<div class="p-6">
								<!-- Tags -->
								{#if post.tags && post.tags.length > 0}
									<div class="flex flex-wrap gap-2 mb-3">
										{#each post.tags.slice(0, 2) as tag}
											<span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
												{tag.nama}
											</span>
										{/each}
									</div>
								{/if}

								<h3
									class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2"
								>
									{post.judul}
								</h3>

								<p class="text-gray-400 text-sm mb-4 line-clamp-3">
									{stripHtml(post.konten)}
								</p>

								<div class="flex items-center justify-between text-sm">
									<span class="text-gray-500">{formatDate(post.createdAt)}</span>
									<span class="text-blue-500 group-hover:translate-x-1 transition-transform">
										Baca →
									</span>
								</div>
							</div>
						</a>
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex justify-center gap-2 mt-12">
						{#each Array(totalPages) as _, i}
							<button
								on:click={() => {
									currentPage = i + 1;
									loadPosts();
								}}
								class="w-10 h-10 flex items-center justify-center rounded-full transition-colors {currentPage ===
								i + 1
									? 'bg-blue-500 text-white'
									: 'bg-white/5 text-gray-400 hover:bg-white/10'}"
							>
								{i + 1}
							</button>
						{/each}
					</div>
				{/if}
			{:else}
				<div class="text-center py-20">
					<div class="text-6xl mb-4">📝</div>
					<h3 class="text-2xl font-bold text-white mb-2">Belum Ada Artikel</h3>
					<p class="text-gray-400">Artikel akan segera hadir. Stay tuned!</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
		<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
	</footer>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
