<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { siteConfig } from '$lib/config';
	import { LL, locale } from '$i18n/i18n-svelte';
	import LanguageSwitcher from '../ui/LanguageSwitcher.svelte';
	import Button from '../ui/Button.svelte';
	import { page } from '$app/state';

	let isOpen = $state(false);
	let isScrolled = $state(false);

	const navItems = $derived([
		{ label: $LL.nav_home(), href: `/${page.params.lang || $locale}` },
		{ label: $LL.nav_fleet(), href: `/${page.params.lang || $locale}/fleet` },
		{ label: $LL.nav_blog(), href: `/${page.params.lang || $locale}/blog` },
		{ label: $LL.nav_booking(), href: `/${page.params.lang || $locale}/booking` }
	]);

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav
	class="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ease-[var(--ease-luxury)]"
>
	<a
		href="/{page.params.lang || $locale}"
		class="font-(family-name:--font-display) text-[1.7rem] tracking-[0.03em] uppercase text-white flex items-center gap-2"
	>
		{siteConfig.shortName}
	</a>

	<div class="flex items-center gap-5 md:gap-8">
		<Button
			href="/{page.params.lang || $locale}/booking"
			variant="outline"
			size="sm"
			className="hidden md:inline-flex border-[rgba(166,173,187,0.34)] text-white {isScrolled
				? 'opacity-100 translate-y-0'
				: 'opacity-0 -translate-y-2 pointer-events-none'}"
		>
			{$LL.nav_book_now()}
		</Button>

		<LanguageSwitcher />

		<button
			class="relative z-50 group flex flex-col gap-1.5 p-2 cursor-pointer rounded-xl border border-[rgba(166,173,187,0.18)] bg-[rgba(23,26,32,0.55)] hover:border-accent-soft transition-colors"
			aria-label="Toggle Menu"
			onclick={() => (isOpen = !isOpen)}
		>
			<div
				class="w-8 h-0.5 bg-white transition-all duration-300 rounded-full {isOpen
					? 'rotate-45 translate-y-2'
					: ''}"
			></div>
			<div
				class="w-6 h-0.5 bg-white ml-auto transition-all duration-300 rounded-full {isOpen
					? 'opacity-0'
					: ''} group-hover:w-8"
			></div>
			<div
				class="w-8 h-0.5 bg-white transition-all duration-300 rounded-full {isOpen
					? '-rotate-45 -translate-y-2'
					: ''}"
			></div>
		</button>
	</div>
</nav>

{#if isOpen}
	<div
		class="fixed inset-0 bg-[rgba(5,5,8,0.96)] z-[60] flex flex-col justify-center items-center text-center space-y-12"
		transition:fade={{ duration: 300 }}
	>
		<button
			class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
			onclick={() => (isOpen = false)}
			aria-label="Close Menu"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg
			>
		</button>

		<div class="flex flex-col gap-6">
			{#each navItems as item}
				<a
					href={item.href}
					class="text-5xl md:text-7xl font-(family-name:--font-display) text-white hover:text-[var(--brand-highlight)] transition-colors uppercase tracking-[0.03em]"
					onclick={() => (isOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</div>

		<Button
			href="/{page.params.lang || $locale}/booking"
			variant="primary"
			size="lg"
			className="mt-8 text-sm"
			on:click={() => (isOpen = false)}
		>
			{$LL.nav_booking_now()}
		</Button>
	</div>
{/if}
