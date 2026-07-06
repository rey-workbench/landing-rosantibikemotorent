<script lang="ts">
	import { onMount } from 'svelte';

	let theme = $state('dark');

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'dark';
		theme = savedTheme;
		document.documentElement.setAttribute('data-theme', theme);
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}
</script>

<button
	onclick={toggleTheme}
	class="p-2 rounded-xl border border-[rgba(166,173,187,0.18)] bg-brand-surface-soft/80 text-current hover:border-brand-accent transition-colors cursor-pointer flex items-center justify-center"
	aria-label="Toggle Theme"
>
	{#if theme === 'dark'}
		<!-- Sun icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"
			></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path
				d="M2 12h2"
			></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path
				d="M19.07 4.93l-1.41 1.41"
			></path></svg
		>
	{:else}
		<!-- Moon icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg
		>
	{/if}
</button>
