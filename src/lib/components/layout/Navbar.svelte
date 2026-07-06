<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { siteConfig } from '$lib/config';
	import { LL, locale } from '$i18n/i18n-svelte';
	import LanguageSwitcher from '../ui/LanguageSwitcher.svelte';
	import ThemeSwitcher from '../ui/ThemeSwitcher.svelte';
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
			const heroHeight = window.innerWidth < 768 ? window.innerHeight : window.innerHeight * 4;
			isScrolled = window.scrollY > heroHeight - 80;
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // check initially
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav
	class="fixed top-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-all duration-300 ease-(--ease-luxury) {isScrolled
		? 'bg-brand-surface/80 backdrop-blur-md text-brand-fg'
		: 'text-white'}"
>
	<a href="/{page.params.lang || $locale}" class="flex flex-col text-left group">
		<span
			class="font-display text-[1.1rem] sm:text-[1.5rem] tracking-[0.03em] uppercase {isScrolled
				? 'text-brand-fg'
				: 'text-white'} font-black leading-none"
		>
			{siteConfig.shortName}
		</span>
		<span
			class="text-[0.55rem] sm:text-[0.7rem] tracking-[0.35em] uppercase {isScrolled
				? 'text-brand-muted'
				: 'text-white/60'} font-mono leading-none mt-1 sm:mt-1.5 font-bold group-hover:text-brand-highlight transition-colors"
		>
			MOTORENT
		</span>
	</a>

	<div class="flex items-center gap-5 md:gap-8">
		<ThemeSwitcher />
		<LanguageSwitcher />

		<button
			class="relative z-50 group flex flex-col gap-1.5 p-2 cursor-pointer rounded-xl border border-[rgba(166,173,187,0.18)] bg-brand-surface-soft/80 hover:border-accent-soft transition-colors"
			aria-label="Toggle Menu"
			onclick={() => (isOpen = !isOpen)}
		>
			<div
				class="w-8 h-0.5 {isScrolled
					? 'bg-brand-fg'
					: 'bg-white'} transition-all duration-300 rounded-full {isOpen
					? 'rotate-45 translate-y-2'
					: ''}"
			></div>
			<div
				class="w-6 h-0.5 {isScrolled
					? 'bg-brand-fg'
					: 'bg-white'} ml-auto transition-all duration-300 rounded-full {isOpen
					? 'opacity-0'
					: ''} group-hover:w-8"
			></div>
			<div
				class="w-8 h-0.5 {isScrolled
					? 'bg-brand-fg'
					: 'bg-white'} transition-all duration-300 rounded-full {isOpen
					? '-rotate-45 -translate-y-2'
					: ''}"
			></div>
		</button>
	</div>
</nav>

{#if isOpen}
	<div
		class="fixed inset-0 bg-brand-surface/95 z-60 flex flex-col justify-center items-center text-center space-y-12"
		transition:fade={{ duration: 300 }}
	>
		<button
			class="absolute top-8 right-8 text-brand-muted hover:text-brand-fg transition-colors"
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
					aria-current={page.url.pathname === item.href ? 'page' : undefined}
					class="text-3xl sm:text-5xl md:text-7xl font-display transition-colors uppercase tracking-[0.03em] {page
						.url.pathname === item.href
						? 'text-(--brand-highlight)'
						: 'text-brand-fg hover:text-(--brand-highlight)'}"
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
			onclick={() => (isOpen = false)}
		>
			{$LL.nav_booking_now()}
		</Button>
	</div>
{/if}
