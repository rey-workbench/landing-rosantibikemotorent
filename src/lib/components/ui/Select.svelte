<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string | number = '';
	export let options: { value: string | number; label: string }[] = [];
	export let label = '';
	export let id = '';
	export let required = false;
	export let disabled = false;
	export let placeholder = 'Select option';
	export let className = '';
	export let error = '';

	const dispatch = createEventDispatcher();

	function handleChange(e: Event) {
		dispatch('change', e);
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
		<select
			{id}
			bind:value
			{required}
			{disabled}
			on:change={handleChange}
			on:blur
			class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer
            {error ? 'border-red-500' : ''}"
		>
			<option value="" disabled selected>{placeholder}</option>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>

		<!-- Custom Dropdown Arrow -->
		<div
			class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform duration-300 group-focus-within:rotate-180"
				><polyline points="6 9 12 15 18 9"></polyline></svg
			>
		</div>
	</div>

	{#if error}
		<p class="mt-1 text-xs text-red-500">{error}</p>
	{/if}
</div>

<style>
	select option {
		background-color: #1a1a1a; /* bg-brand-gray */
		color: white;
	}
</style>
