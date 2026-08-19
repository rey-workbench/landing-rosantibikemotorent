<script lang="ts">
	import { fade, slide, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { LL, locale } from '$i18n/i18n-svelte';
	import LanguageSwitcher from '../ui/LanguageSwitcher.svelte';
	import { page } from '$app/state';
	import { jenisMotorService } from '$lib/services';
	import { DEFAULTS } from '$lib/constants';

	let isOpen = $state(false);
	let isScrolled = $state(false);
	let hoveredNavId = $state<string | null>(null);
	let mobileActiveMenuId = $state<string | null>(null);
	let motorGroups = $state<{ title: string; links: { label: string; href: string }[] }[]>([]);
	let motorGroupsPromise: Promise<void> | null = null;

	function ensureMotorGroups() {
		if (motorGroupsPromise) return;
		motorGroupsPromise = jenisMotorService
			.getAll({ limit: DEFAULTS.FLEET_LIST_LIMIT })
			.then((response) => {
				const motors = response.data || [];
				const groups = new Map<string, { label: string; href: string }[]>();

				for (const m of motors) {
					if (!groups.has(m.merk)) {
						groups.set(m.merk, []);
					}
					groups.get(m.merk)!.push({
						label: `${m.merk} ${m.model}`,
						href: `/${page.params.lang || $locale}/fleet/${m.slug}`
					});
				}

				motorGroups = Array.from(groups.entries()).map(([merk, links]) => ({
					title: merk,
					links
				}));
			})
			.catch((err) => {
				console.error(err);
				motorGroupsPromise = null;
			});
	}

	const isHomepage = $derived(
		page.url.pathname === '/' ||
			page.url.pathname === '/id' ||
			page.url.pathname === '/en' ||
			page.url.pathname === '/id/' ||
			page.url.pathname === '/en/'
	);

	// Navbar is light if scrolled, not homepage, menu open, or mega menu open
	const isLight = $derived(isScrolled || !isHomepage || hoveredNavId !== null || isOpen);

	const navItems = $derived([
		{ id: 'home', label: $LL.nav_home(), href: `/${page.params.lang || $locale}` },
		{
			id: 'fleet',
			label: $LL.nav_fleet(),
			href: `/${page.params.lang || $locale}/fleet`,
			children: [
				{
					title: $LL.nav_mega_explore_fleet(),
					links: [
						{ label: $LL.nav_mega_all_motorcycles(), href: `/${page.params.lang || $locale}/fleet` }
					]
				},
				...motorGroups,
				{
					title: $LL.nav_mega_other_services(),
					links: [
						{ label: $LL.nav_mega_customer_support(), href: `/${page.params.lang || $locale}/faq` },
						{ label: $LL.nav_mega_riding_gear(), href: `/${page.params.lang || $locale}/faq` }
					]
				}
			]
		},
		{ id: 'blog', label: $LL.nav_blog(), href: `/${page.params.lang || $locale}/blog` },
		{
			id: 'booking',
			label: $LL.nav_booking(),
			href: `/${page.params.lang || $locale}/booking`,
			children: [
				{
					title: $LL.nav_mega_rental_info(),
					links: [
						{ label: $LL.nav_mega_how_to_order(), href: `/${page.params.lang || $locale}/booking` },
						{ label: $LL.nav_mega_terms(), href: `/${page.params.lang || $locale}/terms` },
						{ label: $LL.nav_mega_faq(), href: `/${page.params.lang || $locale}/faq` }
					]
				}
			]
		}
	]);

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 10;
		};
		window.addEventListener('scroll', handleScroll);
		handleScroll(); // check initially

		return () => window.removeEventListener('scroll', handleScroll);
	});

	let hoveredItemData = $derived(navItems.find((i) => i.id === hoveredNavId));
	let mobileActiveItemData = $derived(navItems.find((i) => i.id === mobileActiveMenuId));
</script>

<nav
	class="fixed top-0 w-full z-50 transition-all duration-300
	{isLight
		? 'bg-white/95 backdrop-blur-md border-b border-black/10 text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
		: 'bg-transparent border-transparent text-white'}"
	onmouseleave={() => (hoveredNavId = null)}
>
	<div
		class="max-w-5xl mx-auto px-4 h-14 md:h-16 flex justify-between items-center text-xs tracking-wide"
	>
		<a
			href="/{page.params.lang || $locale}"
			class="hover:opacity-80 transition-opacity flex items-center"
		>
			<img
				src="/logo.webp"
				alt="Rosantibike Logo"
				width="126"
				height="47"
				fetchpriority="high"
				class="h-12 md:h-14 w-auto object-contain transition-all duration-300 {!isLight
					? 'brightness-0 invert'
					: ''}"
			/>
		</a>

		<!-- Desktop Navigation -->
		<div
			class="hidden md:flex items-center gap-8 h-full {isLight
				? 'text-[#1d1d1f]/70'
				: 'text-white/80'}"
		>
			{#each navItems as item}
				<a
					href={item.href}
					class="h-full flex items-center hover:text-current transition-colors {page.url
						.pathname === item.href
						? isLight
							? 'text-[#1d1d1f] font-medium'
							: 'text-white font-medium'
						: ''}"
					onmouseenter={() => {
						if (item.id === 'fleet') ensureMotorGroups();
						hoveredNavId = item.children ? item.id : null;
					}}
				>
					{item.label}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-3 md:gap-5 {isLight ? 'text-[#1d1d1f]/70' : 'text-white/80'}">
			<LanguageSwitcher isTransparent={!isLight} />

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer transition-all duration-300 {isLight
					? 'text-[#1d1d1f]'
					: 'text-white'} hover:opacity-80"
				aria-label="Toggle Menu"
				onclick={() => {
					isOpen = !isOpen;
					if (!isOpen) mobileActiveMenuId = null;
					else ensureMotorGroups();
				}}
			>
				<div
					class="w-5 h-[1.5px] bg-current transition-all duration-300 rounded-full {isOpen
						? 'rotate-45 translate-y-1.5'
						: ''}"
				></div>
				<div
					class="w-5 h-[1.5px] bg-current transition-all duration-300 rounded-full {isOpen
						? 'opacity-0'
						: ''}"
				></div>
				<div
					class="w-5 h-[1.5px] bg-current transition-all duration-300 rounded-full {isOpen
						? '-rotate-45 -translate-y-2'
						: ''}"
				></div>
			</button>
		</div>
	</div>

	<!-- Desktop Mega Menu Dropdown -->
	{#if hoveredNavId && hoveredItemData && hoveredItemData.children}
		<!-- Backdrop Overlay -->
		<div
			class="hidden md:block fixed inset-0 top-14 md:top-16 bg-black/20 backdrop-blur-md transition-opacity"
			transition:fade={{ duration: 300 }}
		></div>

		<div
			class="hidden md:block absolute top-14 md:top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-t border-black/5 overflow-hidden origin-top"
			transition:slide={{ duration: 300, axis: 'y' }}
		>
			<div class="max-w-5xl mx-auto px-4 py-10 flex gap-16">
				{#each hoveredItemData.children as group}
					<div class="flex flex-col gap-3 min-w-50">
						<h4 class="text-[11px] text-black/50 font-semibold tracking-wide mb-1">
							{group.title}
						</h4>
						{#each group.links as link}
							<a
								href={link.href}
								class="text-xl text-[#1d1d1f] hover:text-[#0071e3] transition-colors font-semibold"
								onclick={() => (hoveredNavId = null)}
							>
								{link.label}
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</nav>

<!-- Mobile Full Screen Menu -->
{#if isOpen}
	<div
		class="fixed inset-0 top-14 md:top-16 bg-white z-40 overflow-hidden flex flex-col md:hidden"
		transition:fade={{ duration: 250 }}
	>
		<!-- Main Mobile Menu -->
		<div
			class="w-full h-full px-6 py-8 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] {mobileActiveMenuId
				? '-translate-x-12 absolute opacity-0 pointer-events-none'
				: 'translate-x-0 relative opacity-100'}"
		>
			<div class="flex flex-col gap-2">
				{#each navItems as item}
					<div class="border-b border-black/5 pb-2 pt-2">
						{#if item.children}
							<button
								class="w-full flex justify-between items-center text-3xl font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors text-left"
								onclick={() => {
									if (item.id === 'fleet') ensureMotorGroups();
									mobileActiveMenuId = item.id;
								}}
							>
								{item.label}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="opacity-40"><polyline points="9 18 15 12 9 6"></polyline></svg
								>
							</button>
						{:else}
							<a
								href={item.href}
								class="w-full flex text-3xl font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors text-left"
								onclick={() => (isOpen = false)}
							>
								{item.label}
							</a>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Drill Down Mobile Menu -->
		{#if mobileActiveItemData && mobileActiveItemData.children}
			<div
				class="absolute top-0 left-0 w-full h-full bg-white px-6 py-8 flex flex-col gap-6"
				in:fly={{ x: '100%', duration: 400, opacity: 1, easing: (t) => 1 - Math.pow(1 - t, 4) }}
				out:fly={{ x: '100%', duration: 300, opacity: 1 }}
			>
				<button
					class="flex items-center gap-1.5 text-sm font-medium text-[#1d1d1f] opacity-60 hover:opacity-100 transition-opacity mb-2 -ml-2"
					onclick={() => (mobileActiveMenuId = null)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg
					>
					Kembali
				</button>

				<h2 class="text-[32px] leading-tight font-semibold text-[#1d1d1f] mb-4">
					{mobileActiveItemData.label}
				</h2>

				<div class="flex flex-col gap-8">
					{#each mobileActiveItemData.children as group}
						<div class="flex flex-col gap-3">
							<h4 class="text-[11px] text-black/50 font-semibold tracking-wide">
								{group.title}
							</h4>
							<div class="flex flex-col gap-3">
								{#each group.links as link}
									<a
										href={link.href}
										class="text-2xl font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
										onclick={() => {
											isOpen = false;
											mobileActiveMenuId = null;
										}}
									>
										{link.label}
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
