<script lang="ts">
	import { fly } from 'svelte/transition';

	let {
		error,
		onClose
	}: {
		error: string;
		onClose: () => void;
	} = $props();
</script>

<div
	transition:fly={{ y: 50, duration: 300 }}
	class="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-max md:max-w-md z-50 bg-red-50 border border-red-200/80 rounded-2xl p-4 shadow-xl flex items-start gap-3"
>
	<svg
		class="w-5 h-5 text-red-500 shrink-0 mt-0.5"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
	<div class="flex-1 min-w-0">
		<p class="text-red-800 text-sm font-semibold mb-0.5">Oops!</p>
		<p class="text-red-700 text-xs sm:text-sm font-medium leading-snug">{error}</p>
	</div>
	<button
		type="button"
		aria-label="Tutup pesan error"
		onclick={onClose}
		class="p-1 rounded-lg text-red-500 hover:bg-red-100 transition-colors shrink-0"
	>
		<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>
</div>
