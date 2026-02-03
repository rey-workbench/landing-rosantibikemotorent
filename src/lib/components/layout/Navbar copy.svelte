<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let isOpen = false;
	let isScrolled = false;

	const navItems = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Katalog', href: '/fleet' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'Booking', href: '/booking' }
	];

	$: currentPath = $page?.url?.pathname || '/';
	$: isLanding = currentPath === '/';

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<!-- Simplified Navbar to debug visibility -->
<nav class="fixed-nav" class:solid-bg={isScrolled || !isLanding}>
	<div class="nav-content">
		<!-- Brand -->
		<a href="/" class="brand-logo">Rosantibike</a>

		<!-- Navigation Links -->
		<div class="nav-links-wrapper">
			<!-- Links (Visible on desktop) -->
			<div class="desktop-nav">
				{#each navItems as item}
					<a href={item.href} class="nav-link" class:active={currentPath === item.href}>
						{item.label}
					</a>
				{/each}
				<a href="/booking" class="btn-primary">Book Now</a>
			</div>

			<!-- Hamburger (Visible on mobile/tablet) -->
			<button class="hamburger-btn" on:click={() => (isOpen = !isOpen)} aria-label="Menu">
				<span class="bar" class:bar-top={isOpen}></span>
				<span class="bar" class:bar-mid={isOpen}></span>
				<span class="bar" class:bar-bot={isOpen}></span>
			</button>
		</div>
	</div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isOpen}
	<div class="mobile-overlay" transition:fade={{ duration: 200 }}>
		<div class="mobile-links">
			{#each navItems as item}
				<a href={item.href} class="mobile-link" on:click={() => (isOpen = false)}>
					{item.label}
				</a>
			{/each}
			<a href="/booking" class="mobile-btn" on:click={() => (isOpen = false)}> Sewa Sekarang </a>
		</div>
	</div>
{/if}

<style>
	.fixed-nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		padding: 24px 0;
		transition: all 0.3s ease;
		background: transparent; /* Default is transparent */
	}

	.solid-bg {
		background: rgba(10, 10, 10, 0.9) !important;
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 16px 0;
	}

	.nav-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.brand-logo {
		color: white;
		font-size: 24px;
		font-weight: 800;
		text-transform: uppercase;
		text-decoration: none;
		letter-spacing: -0.5px;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	}

	.nav-links-wrapper {
		display: flex;
		align-items: center;
	}

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.nav-link {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		transition: color 0.2s;
	}

	.nav-link:hover,
	.nav-link.active {
		color: white;
	}

	.btn-primary {
		background: white;
		color: black;
		padding: 10px 24px;
		border-radius: 99px;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		text-decoration: none;
		transition: all 0.2s;
	}

	.hamburger-btn {
		display: none; /* Hidden on desktop */
		background: none;
		border: none;
		padding: 10px;
		cursor: pointer;
		flex-direction: column;
		gap: 6px;
	}

	.bar {
		width: 28px;
		height: 2px;
		background: white;
		transition: all 0.3s;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
	}

	.bar-top {
		transform: translateY(8px) rotate(45deg);
	}
	.bar-mid {
		opacity: 0;
	}
	.bar-bot {
		transform: translateY(-8px) rotate(-45deg);
	}

	.mobile-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #0a0a0a;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mobile-links {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}

	.mobile-link {
		color: white;
		font-size: 32px;
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}

	.mobile-btn {
		background: #3b82f6;
		color: white;
		padding: 16px 40px;
		border-radius: 12px;
		font-size: 18px;
		font-weight: 600;
		text-decoration: none;
		text-transform: uppercase;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.desktop-nav {
			display: none;
		}
		.hamburger-btn {
			display: flex;
		}
		.nav-content {
			padding: 0 24px;
		}
	}
</style>
