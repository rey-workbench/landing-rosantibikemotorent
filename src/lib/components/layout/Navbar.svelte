<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { siteConfig } from '$lib/config';

	let isOpen = false;
	let isScrolled = false;

	const navItems = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Katalog', href: '/fleet' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'Booking', href: '/booking' }
	];

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav
	class="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 mix-blend-difference"
>
	<a
		href="/"
		class="text-2xl font-bold tracking-tighter uppercase text-white flex items-center gap-2"
	>
		{siteConfig.shortName}
	</a>

	<div class="flex items-center gap-8">
		<!-- Book Now Button -->
		<a
			href="/booking"
			class="hidden md:block px-6 py-2 rounded-full border border-white/20 text-sm font-bold text-white hover:bg-white hover:text-black transition-colors {isScrolled
				? 'opacity-100'
				: 'opacity-0'} duration-300"
		>
			Book Now
		</a>

		<!-- Hamburger Menu Button - Visible on ALL screens -->
		<button
			class="relative z-50 group flex flex-col gap-1.5 p-2 cursor-pointer"
			aria-label="Toggle Menu"
			on:click={() => (isOpen = !isOpen)}
		>
			<div
				class="w-8 h-0.5 bg-white shadow-sm transition-all duration-300 rounded-full {isOpen
					? 'rotate-45 translate-y-2'
					: ''}"
			></div>
			<div
				class="w-6 h-0.5 bg-white shadow-sm ml-auto transition-all duration-300 rounded-full {isOpen
					? 'opacity-0'
					: ''} group-hover:w-8"
			></div>
			<div
				class="w-8 h-0.5 bg-white shadow-sm transition-all duration-300 rounded-full {isOpen
					? '-rotate-45 -translate-y-2'
					: ''}"
			></div>
		</button>
	</div>
</nav>

{#if isOpen}
	<div
		class="fixed inset-0 bg-brand-dark/98 backdrop-blur-3xl z-[60] flex flex-col justify-center items-center text-center space-y-12"
		transition:fade={{ duration: 300 }}
	>
		<!-- Close Button (Top Right) -->
		<button
			class="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
			on:click={() => (isOpen = false)}
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
					class="text-5xl md:text-7xl font-black text-white hover:text-blue-500 transition-colors uppercase tracking-tighter font-sans"
					on:click={() => (isOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</div>

		<a
			href="/booking"
			class="mt-8 px-10 py-5 bg-white text-black font-black text-xl rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest"
			on:click={() => (isOpen = false)}
		>
			Booking Sekarang
		</a>
	</div>
{/if}
