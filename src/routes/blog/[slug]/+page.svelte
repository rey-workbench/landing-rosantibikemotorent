<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade, fly } from 'svelte/transition';

	export let data;
	$: post = data.post;

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
		<title>{post.metaTitle || post.judul} | Rosantibike Journal</title>
		<meta name="description" content={post.metaDescription || post.judul} />
		{#if post.featuredImage}
			<meta property="og:image" content={post.featuredImage} />
		{/if}
	{:else}
		<title>Artikel | Rosantibike Motorent</title>
	{/if}
</svelte:head>

{#if post}
	<!-- Header -->
	<header class="relative pt-32 pb-16 px-4 md:px-10">
		<div class="max-w-4xl mx-auto text-center">
			<a
				href="/blog"
				class="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				Kembali ke Journal
			</a>

			<div class="flex flex-wrap justify-center gap-2 mb-6">
				{#if post.kategori}
					<span
						class="px-4 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full"
					>
						{post.kategori.nama}
					</span>
				{/if}
				{#if post.tags}
					{#each post.tags as tag}
						<span
							class="px-4 py-1 bg-brand-surface border border-brand-border text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full"
						>
							#{tag.nama}
						</span>
					{/each}
				{/if}
			</div>

			<h1
				class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase mb-8"
			>
				{post.judul}
			</h1>

			<div
				class="flex items-center justify-center gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest"
			>
				<time datetime={post.createdAt}>{post.formattedDate}</time>
				<span class="w-1 h-1 bg-gray-700 rounded-full"></span>
				<span>5 Menit Baca</span>
			</div>
		</div>
	</header>

	<!-- Content -->
	<article class="pb-32 px-4 md:px-10">
		<div class="max-w-4xl mx-auto">
			<!-- Image -->
			{#if post.featuredImage || post.thumbnail}
				<div
					class="mb-16 rounded-3xl overflow-hidden glass-surface aspect-[16/9]"
					in:fade={{ duration: 800 }}
				>
					<img
						src={post.featuredImage || post.thumbnail}
						alt={post.judul}
						class="w-full h-full object-cover"
					/>
				</div>
			{/if}

			<!-- Text -->
			<div class="prose prose-invert max-w-none article-content">
				{@html post.konten}
			</div>

			<!-- Footer / Share -->
			<div
				class="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between gap-8"
			>
				<div>
					<h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Bagikan</h3>
					<div class="flex gap-3">
						<a
							href="https://wa.me/?text={encodeURIComponent(post.judul + ' - ' + getCurrentUrl())}"
							target="_blank"
							rel="noopener noreferrer"
							class="w-10 h-10 glass-surface rounded-xl flex items-center justify-center hover:bg-green-600 hover:border-green-500 transition-all"
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
							on:click={copyLink}
							class="w-10 h-10 glass-surface rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path
									d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
								></path></svg
							>
						</button>
					</div>
				</div>

				<div class="flex items-center">
					<Button href="/booking" variant="primary" size="lg">Sewa Motor Sekarang</Button>
				</div>
			</div>
		</div>
	</article>
{/if}

<style>
	.article-content {
		color: #9ca3af;
		line-height: 1.8;
	}

	:global(.article-content h2) {
		color: white;
		font-weight: 900;
		font-size: 2rem;
		margin: 3rem 0 1.5rem;
		text-transform: uppercase;
		letter-spacing: -0.02em;
	}

	:global(.article-content p) {
		margin-bottom: 1.5rem;
	}

	:global(.article-content img) {
		border-radius: 1.5rem;
		margin: 3rem 0;
		border: 1px solid #262626;
	}

	:global(.article-content blockquote) {
		border-left: 4px solid #3b82f6;
		padding: 1.5rem 2rem;
		background: #121212;
		border-radius: 0 1rem 1rem 0;
		margin: 2rem 0;
		font-style: italic;
	}
</style>
