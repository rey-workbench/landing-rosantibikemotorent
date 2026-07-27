<script lang="ts">
	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
		size?: 'sm' | 'md' | 'lg' | 'icon';
		disabled?: boolean;
		loading?: boolean;
		href?: string | undefined;
		fullWidth?: boolean;
		className?: string;
		onclick?: (e: MouseEvent) => void;
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		href = undefined,
		fullWidth = false,
		className = '',
		children,
		onclick,
		...rest
	}: Props = $props();

	// Styling base
	const baseStyles =
		'inline-flex items-center justify-center font-semibold uppercase tracking-[0.18em] transition-all duration-300 ease-(--ease-luxury) focus-visible:focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

	// Variants
	const variants = {
		primary:
			'bg-brand-fg text-brand-surface border border-transparent hover:opacity-90 hover:-translate-y-0.5',
		secondary:
			'surface-panel text-brand-fg border border-brand-border hover:border-brand-accent hover:bg-brand-surface-soft',
		outline:
			'bg-transparent text-brand-fg border border-brand-border hover:border-brand-accent hover:bg-brand-surface-soft',
		ghost: 'bg-transparent text-brand-muted hover:text-brand-fg hover:bg-brand-surface-soft',
		glass:
			'bg-white/10 text-brand-fg border border-brand-border hover:border-brand-accent hover:bg-brand-surface-soft'
	};

	// Sizes
	const sizes = {
		sm: 'text-[0.68rem] px-4 py-2 rounded-xl',
		md: 'text-[0.74rem] px-6 py-3 rounded-2xl',
		lg: 'text-[0.82rem] px-8 py-4 rounded-[1.35rem]',
		icon: 'p-3 rounded-xl'
	};

	let classes = $derived(
		[baseStyles, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

{#if href}
	<a {href} class={classes} {onclick} {...rest}>
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
		{@render children?.()}
	</a>
{:else}
	<button {type} class={classes} {disabled} {onclick} {...rest}>
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
		{@render children?.()}
	</button>
{/if}
