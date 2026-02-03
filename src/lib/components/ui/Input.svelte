<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string | number = '';
	export let placeholder = '';
	export let type = 'text';
	export let label = '';
	export let id = '';
	export let required = false;
	export let disabled = false;
	export let icon: 'search' | 'user' | 'phone' | 'email' | 'calendar' | 'none' = 'none';
	export let className = '';
	export let error = '';

	const dispatch = createEventDispatcher();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		dispatch('input', e);
	}
</script>

<div class="w-full {className}">
	{#if label}
		<label for={id} class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
			{label}
			{required ? '*' : ''}
		</label>
	{/if}

	<div class="relative group">
		{#if icon !== 'none'}
			<div
				class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors pointer-events-none"
			>
				{#if icon === 'search'}
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
						><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"
						></line></svg
					>
				{:else if icon === 'user'}
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
						><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"
						></circle></svg
					>
				{:else if icon === 'phone'}
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
						><path
							d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
						></path></svg
					>
				{:else if icon === 'calendar'}
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
						><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line
							x1="16"
							y1="2"
							x2="16"
							y2="6"
						></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"
						></line></svg
					>
				{:else if icon === 'email'}
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
						><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
						></path><polyline points="22,6 12,13 2,6"></polyline></svg
					>
				{/if}
			</div>
		{/if}

		<input
			{id}
			{type}
			{value}
			{placeholder}
			{required}
			{disabled}
			on:input={handleInput}
			on:focus
			on:blur
			class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300
            {icon !== 'none' ? 'pl-12' : ''} {error ? 'border-red-500' : ''}"
		/>
	</div>
	{#if error}
		<p class="mt-1 text-xs text-red-500">{error}</p>
	{/if}
</div>
