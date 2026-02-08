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
		'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

	// Variants
	const variants = {
		primary: 'bg-white text-black hover:bg-gray-200 border border-transparent',
		secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-transparent',
		outline: 'bg-transparent text-white border border-white/30 hover:bg-white/10',
		ghost: 'bg-transparent text-white hover:text-gray-300 hover:bg-white/5',
		glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
	};

	// Sizes
	const sizes = {
		sm: 'text-xs px-4 py-2 rounded-lg',
		md: 'text-sm px-6 py-3 rounded-xl',
		lg: 'text-base px-8 py-4 rounded-2xl',
		icon: 'p-3 rounded-xl'
	};

	$: classes = `
		${baseStyles} 
		${variants[variant]} 
		${sizes[size]} 
		${fullWidth ? 'w-full' : ''} 
		${className}
	`;

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
