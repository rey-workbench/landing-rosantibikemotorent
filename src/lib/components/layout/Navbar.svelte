<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

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
		Rosantibike
	</a>

	<div class="flex items-center gap-8">
		<!-- Desktop Nav Links -->
		<div class="hidden lg:flex items-center gap-6">
			{#each navItems as item}
				<a
					href={item.href}
					class="text-sm font-medium text-white/80 hover:text-white transition-colors uppercase tracking-wider"
				>
					{item.label}
				</a>
			{/each}
		</div>

		<a
			href="/booking"
			class="hidden md:block px-6 py-2 rounded-full border border-white/20 text-sm font-bold text-white hover:bg-white hover:text-black transition-colors {isScrolled
				? 'opacity-100'
				: 'opacity-0'} duration-300"
		>
			Book Now
		</a>

		<button
			class="relative z-50 group flex flex-col gap-1.5 lg:hidden p-2 cursor-pointer"
			aria-label="Toggle Menu"
			on:click={() => (isOpen = !isOpen)}
		>
			<div
				class="w-8 h-1 bg-white shadow-md transition-all duration-300 rounded-full {isOpen
					? 'rotate-45 translate-y-2.5'
					: ''}"
			></div>
			<div
				class="w-6 h-1 bg-white shadow-md ml-auto transition-all duration-300 rounded-full {isOpen
					? 'opacity-0'
					: ''} group-hover:w-8"
			></div>
			<div
				class="w-8 h-1 bg-white shadow-md transition-all duration-300 rounded-full {isOpen
					? '-rotate-45 -translate-y-2.5'
					: ''}"
			></div>
		</button>
	</div>
</nav>

{#if isOpen}
	<div
		class="fixed inset-0 bg-brand-dark z-40 flex flex-col justify-center items-center text-center space-y-8"
		transition:fade={{ duration: 300 }}
	>
		{#each navItems as item}
			<a
				href={item.href}
				class="text-4xl md:text-6xl font-bold hover:text-gray-400 transition-colors"
				on:click={() => (isOpen = false)}>{item.label}</a
			>
		{/each}
		<a
			href="/booking"
			class="mt-8 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
			on:click={() => (isOpen = false)}
		>
			Booking Sekarang
		</a>
	</div>
{/if}
