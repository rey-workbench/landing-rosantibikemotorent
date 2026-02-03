<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { blogApi } from '$lib/api';
	import type { BlogPost } from '$lib/types';
	import { browser } from '$app/environment';

	let post: BlogPost | null = null;
	let loading = true;
	let error = '';

	$: slug = $page.params.slug;

	onMount(async () => {
		if (!slug) {
			error = 'Slug tidak ditemukan';
			loading = false;
			return;
		}

		try {
			post = await blogApi.getBySlug(slug);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Artikel tidak ditemukan';
		} finally {
			loading = false;
		}
	});

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

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

<svelte:head>
	{#if post}
		<title>{post.metaTitle || post.judul} - Rosantibike Motorent</title>
		<meta name="description" content={post.metaDescription || post.judul} />
		{#if post.featuredImage}
			<meta property="og:image" content={post.featuredImage} />
		{/if}
	{:else}
		<title>Artikel - Rosantibike Motorent</title>
	{/if}
</svelte:head>

<div class="min-h-screen bg-brand-dark text-white">
	<Navbar />

	<!-- Back Button -->
	<div class="pt-24 px-4 md:px-10">
		<div class="max-w-4xl mx-auto">
			<a
				href="/blog"
				class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				Kembali ke Blog
			</a>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center py-32">
			<div
				class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
			></div>
		</div>
	{:else if error}
		<div class="text-center py-32">
			<div class="text-6xl mb-4">⚠️</div>
			<h3 class="text-2xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h3>
			<p class="text-gray-400">{error}</p>
			<a
				href="/blog"
				class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors"
			>
				Kembali ke Blog
			</a>
		</div>
	{:else if post}
		<article class="py-12 px-4 md:px-10">
			<div class="max-w-4xl mx-auto">
				<!-- Header -->
				<header class="mb-12">
					<!-- Tags -->
					{#if post.tags && post.tags.length > 0}
						<div class="flex flex-wrap gap-2 mb-6">
							{#each post.tags as tag}
								<span class="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
									{tag.nama}
								</span>
							{/each}
						</div>
					{/if}

					<h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
						{post.judul}
					</h1>

					<div class="flex items-center gap-4 text-gray-400">
						<time datetime={post.createdAt}>{formatDate(post.createdAt)}</time>
					</div>
				</header>

				<!-- Featured Image -->
				{#if post.featuredImage}
					<div class="mb-12 rounded-3xl overflow-hidden">
						<img src={post.featuredImage} alt={post.judul} class="w-full h-auto object-cover" />
					</div>
				{/if}

				<!-- Content -->
				<div class="prose prose-invert prose-lg max-w-none">
					{@html post.konten}
				</div>

				<!-- Share Section -->
				<div class="mt-16 pt-8 border-t border-white/10">
					<h3 class="text-lg font-bold text-white mb-4">Bagikan Artikel</h3>
					<div class="flex gap-4">
						<a
							href="https://wa.me/?text={encodeURIComponent(post.judul + ' - ' + getCurrentUrl())}"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Share on WhatsApp"
							class="w-12 h-12 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
								/>
							</svg>
						</a>
						<a
							href="https://twitter.com/intent/tweet?text={encodeURIComponent(
								post.judul
							)}&url={encodeURIComponent(getCurrentUrl())}"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Share on Twitter"
							class="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
								/>
							</svg>
						</a>
						<button
							on:click={copyLink}
							class="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
							title="Salin Link"
							aria-label="Copy link"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
								<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
							</svg>
						</button>
					</div>
				</div>

				<!-- CTA -->
				<div
					class="mt-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 md:p-12 text-center"
				>
					<h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Siap untuk Berpetualang?</h3>
					<p class="text-gray-400 mb-6 max-w-md mx-auto">
						Jelajahi Malang dengan motor berkualitas dari Rosantibike. Booking sekarang!
					</p>
					<a
						href="/fleet"
						class="inline-block px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wider rounded-2xl hover:bg-gray-200 transition-colors"
					>
						Lihat Armada Kami
					</a>
				</div>
			</div>
		</article>
	{/if}

	<!-- Footer -->
	<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
		<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
	</footer>
</div>

<style>
	:global(.prose) {
		color: #d1d5db;
	}

	:global(.prose h2) {
		color: white;
		font-weight: 700;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose h3) {
		color: white;
		font-weight: 600;
	}

	:global(.prose p) {
		margin-bottom: 1.5rem;
		line-height: 1.8;
	}

	:global(.prose a) {
		color: #60a5fa;
		text-decoration: underline;
	}

	:global(.prose a:hover) {
		color: #93c5fd;
	}

	:global(.prose img) {
		border-radius: 1rem;
		margin: 2rem 0;
	}

	:global(.prose ul, .prose ol) {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	:global(.prose li) {
		margin-bottom: 0.5rem;
	}

	:global(.prose blockquote) {
		border-left: 4px solid #3b82f6;
		padding-left: 1rem;
		font-style: italic;
		color: #9ca3af;
	}

	:global(.prose code) {
		background-color: rgba(255, 255, 255, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	:global(.prose pre) {
		background-color: rgba(0, 0, 0, 0.5);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
	}
</style>
