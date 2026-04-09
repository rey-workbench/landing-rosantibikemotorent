<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' = 'primary';
	export let size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
	export let disabled = false;
	export let loading = false;
	export let href: string | undefined = undefined;
	export let fullWidth = false;
	export let className = '';

	// Styling base
	const baseStyles =
		'inline-flex items-center justify-center font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-[var(--ease-luxury)] focus-visible:focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

	// Variants
	const variants = {
		primary:
			'bg-white text-black border border-transparent hover:bg-[rgba(255,255,255,0.9)] hover:-translate-y-0.5',
		secondary:
			'surface-panel text-white border border-[rgba(166,173,187,0.25)] hover:border-accent-soft hover:bg-[rgba(166,173,187,0.1)]',
		outline:
			'bg-transparent text-white border border-[rgba(166,173,187,0.4)] hover:border-accent-soft hover:bg-accent-soft',
		ghost: 'bg-transparent text-[var(--brand-muted)] hover:text-white hover:bg-white/6',
		glass:
			'bg-[rgba(255,255,255,0.06)] text-white border border-[rgba(166,173,187,0.24)] hover:border-accent-soft hover:bg-[rgba(166,173,187,0.14)]'
	};

	// Sizes
	const sizes = {
		sm: 'text-[0.68rem] px-4 py-2 rounded-xl',
		md: 'text-[0.74rem] px-6 py-3 rounded-2xl',
		lg: 'text-[0.82rem] px-8 py-4 rounded-[1.35rem]',
		icon: 'p-3 rounded-xl'
	};

	$: classes = [baseStyles, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className]
		.filter(Boolean)
		.join(' ');

	const dispatch = createEventDispatcher();

	function handleClick(e: MouseEvent) {
		if (!disabled && !loading) {
			dispatch('click', e);
		}
	}
</script>

{#if href}
	<a {href} class={classes} on:click={handleClick} {...$$restProps}>
		{#if loading}
			<svg
				class="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		{/if}
		<slot />
	</a>
{:else}
	<button {type} class={classes} {disabled} on:click={handleClick} {...$$restProps}>
		{#if loading}
			<svg
				class="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		{/if}
		<slot />
	</button>
{/if}
