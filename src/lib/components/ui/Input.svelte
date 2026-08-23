<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import LL from '$i18n/i18n-svelte.js';

	interface Props {
		value?: string | number;
		placeholder?: string;
		label?: string;
		id?: string;
		error?: string;
		className?: string;
		type?: 'text' | 'number' | 'date' | 'time' | 'tel' | 'email' | 'dropdown';
		required?: boolean;
		disabled?: boolean;
		searchable?: boolean;
		options?: { value: string | number; label: string }[];
		icon?: 'search' | 'user' | 'phone' | 'email' | 'calendar' | 'clock' | 'none';
		hint?: string;
		onchange?: (value: string | number) => void;
		oninput?: (value: string | number) => void;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		label = '',
		id = '',
		error = '',
		className = '',
		type = 'text',
		required = false,
		disabled = false,
		searchable = true,
		options = [],
		icon = 'none',
		hint = '',
		onchange,
		oninput
	}: Props = $props();

	const iconPaths = {
		search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
		user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
		phone:
			'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
		email:
			'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
		calendar:
			'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18',
		clock: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2'
	};

	let isOpen = $state(false),
		containerRef: HTMLElement | undefined = $state(),
		searchTerm = $state('');

	// Date/Time State
	let current = new Date();
	let view = $state({ month: current.getMonth(), year: current.getFullYear() });
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
	const mins = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

	const select = (v: any) => {
		value = v;
		isOpen = false;
		onchange?.(value);
	};
	const adjustMonth = (d: number) => {
		view.month += d;
		if (view.month > 11) {
			view.month = 0;
			view.year++;
		} else if (view.month < 0) {
			view.month = 11;
			view.year--;
		}
	};
	const step = (d: number) => {
		value = Number(value) + d;
		oninput?.(value);
	};

	onMount(() => {
		const hide = (e: MouseEvent) =>
			containerRef && !containerRef.contains(e.target as Node) && (isOpen = false);
		document.addEventListener('click', hide);
		return () => document.removeEventListener('click', hide);
	});
	let actualId = $derived(id || `input-${Math.random().toString(36).slice(2, 11)}`);
	let selectedLabel = $derived(
		type === 'dropdown'
			? options.find((o) => o.value == value)?.label || ''
			: value?.toString() || ''
	);
	let filteredOptions = $derived(
		options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
	);
	let calendarDays = $derived(
		(() => {
			const start = new Date(view.year, view.month, 1).getDay();
			const daysInMo = new Date(view.year, view.month + 1, 0).getDate();
			const prevDaysInMo = new Date(view.year, view.month, 0).getDate();
			return [
				...Array.from({ length: start }, (_, i) => ({
					d: prevDaysInMo - start + i + 1,
					curr: false
				})),
				...Array.from({ length: daysInMo }, (_, i) => ({ d: i + 1, curr: true })),
				...Array.from({ length: 42 - (start + daysInMo) }, (_, i) => ({ d: i + 1, curr: false }))
			];
		})()
	);
</script>

<div
	class="w-full relative {className}"
	bind:this={containerRef}
	style="z-index: {isOpen ? 1000 : 1}"
>
	{#if label}
		<label
			for={actualId}
			class="block text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] mb-1.5"
		>
			{label}
			{#if required}<span class="text-red-500 ml-0.5">*</span>{/if}
		</label>
	{/if}

	<div class="relative group">
		{#if ['dropdown', 'date', 'time'].includes(type)}
			<button
				id={actualId}
				type="button"
				{disabled}
				onclick={() => !disabled && ((isOpen = !isOpen), (searchTerm = ''))}
				class="w-full bg-[#f5f5f7] border border-black/8 rounded-xl px-4 py-3 text-left flex items-center justify-between gap-3 transition-all hover:bg-[#e8e8ed] hover:border-black/15 focus:ring-4 focus:ring-apple-blue/10 {error
					? 'border-red-500'
					: ''} {disabled ? 'opacity-50 cursor-not-allowed' : ''} {isOpen
					? 'border-apple-blue bg-white ring-4 ring-apple-blue/10'
					: ''}"
			>
				<div class="flex items-center gap-3 truncate">
					{#if icon !== 'none' && iconPaths[icon]}
						<svg
							class="text-[#6b6b70] shrink-0"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d={iconPaths[icon]} />
						</svg>
					{/if}
					<span class="truncate {selectedLabel ? 'text-[#1d1d1f] font-medium' : 'text-[#6b6b70]'}"
						>{selectedLabel || placeholder || $LL.ui_select()}</span
					>
				</div>
				<svg
					class="text-[#6b6b70] shrink-0 transition-transform duration-200 {isOpen
						? 'rotate-180 text-[#1d1d1f]'
						: ''}"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"><polyline points="6 9 12 15 18 9" /></svg
				>
			</button>

			{#if isOpen}
				<div
					transition:fly={{ y: -10, duration: 200 }}
					class="absolute left-0 w-full min-w-65 md:max-w-75 mt-2 bg-white border border-black/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl z-99999"
				>
					{#if type === 'dropdown'}
						{#if searchable}
							<div class="p-2 border-b border-black/5">
								<input
									type="text"
									bind:value={searchTerm}
									placeholder={$LL.ui_search()}
									aria-label={$LL.ui_search()}
									class="w-full bg-[#f5f5f7] border border-black/5 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:outline-none"
									onclick={(e) => e.stopPropagation()}
								/>
							</div>
						{/if}
						<div class="max-h-60 overflow-y-auto scrollbar-custom">
							{#each filteredOptions as opt}
								<button
									type="button"
									onclick={() => select(opt.value)}
									class="w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors {opt.value ==
									value
										? 'bg-apple-blue/10 text-apple-blue font-semibold'
										: 'text-[#1d1d1f] hover:bg-[#f5f5f7]'}"
								>
									<span>{opt.label}</span>
									{#if opt.value == value}<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg
										>{/if}
								</button>
							{/each}
						</div>
					{:else if type === 'date'}
						<div class="p-3">
							<div class="flex items-center justify-between mb-3 px-1">
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										adjustMonth(-1);
									}}
									class="p-1 hover:bg-[#f5f5f7] rounded text-[#1d1d1f]"
									aria-label={$LL.ui_month_prev()}
									><svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"><polyline points="15 18 9 12 15 6" /></svg
									></button
								>
								<div class="text-[11px] font-semibold text-[#1d1d1f] uppercase tracking-wider">
									{months[view.month]}
									{view.year}
								</div>
								<button
									type="button"
									onclick={(e) => {
										e.stopPropagation();
										adjustMonth(1);
									}}
									class="p-1 hover:bg-[#f5f5f7] rounded text-[#1d1d1f]"
									aria-label={$LL.ui_month_next()}
									><svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg
									></button
								>
							</div>
							<div class="grid grid-cols-7 gap-px mb-1">
								{#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as d}<div
										class="text-[9px] font-semibold text-[#6b6b70] text-center"
									>
										{d}
									</div>{/each}
							</div>
							<div class="grid grid-cols-7 gap-px">
								{#each calendarDays as { d, curr }}
									<button
										type="button"
										onclick={(e) => {
											e.stopPropagation();
											if (curr)
												select(
													`${view.year}-${(view.month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
												);
										}}
										class="aspect-square flex items-center justify-center text-[11px] rounded-lg transition-colors {curr
											? 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
											: 'text-[#6b6b70]/30 pointer-events-none'} {curr &&
										value ===
											`${view.year}-${(view.month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
											? 'bg-apple-blue text-white font-bold shadow-sm'
											: ''}">{d}</button
									>
								{/each}
							</div>
						</div>
					{:else if type === 'time'}
						<div class="p-2 grid grid-cols-2 gap-2 h-48 font-medium">
							<div class="overflow-y-auto scrollbar-custom pr-1">
								{#each hours as h}<button
										onclick={(e) => {
											e.stopPropagation();
											select(`${h}:${value.toString().split(':')[1] || '00'}`);
										}}
										class="w-full py-1.5 text-xs rounded transition-colors {value
											.toString()
											.startsWith(h + ':')
											? 'bg-apple-blue text-white font-semibold'
											: 'text-[#6b6b70] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}">{h}</button
									>{/each}
							</div>
							<div class="overflow-y-auto scrollbar-custom pr-1 border-l border-black/5 pl-2">
								{#each mins as m}<button
										onclick={(e) => {
											e.stopPropagation();
											select(`${value.toString().split(':')[0] || '08'}:${m}`);
										}}
										class="w-full py-1.5 text-xs rounded transition-colors {value
											.toString()
											.endsWith(':' + m)
											? 'bg-apple-blue text-white font-semibold'
											: 'text-[#6b6b70] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}">{m}</button
									>{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		{:else}
			<input
				id={actualId}
				{type}
				{value}
				{placeholder}
				{required}
				{disabled}
				oninput={(e) => (value = e.currentTarget.value)}
				class="w-full bg-[#f5f5f7] border border-black/8 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1d1d1f] focus:ring-4 focus:ring-apple-blue/10 focus:outline-none transition-all {type ===
				'number'
					? 'pr-12'
					: ''} {error ? 'border-red-500' : ''}"
			/>
			{#if type === 'number'}
				<div class="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-px">
					<button
						type="button"
						onclick={() => step(1)}
						class="p-1 hover:text-[#1d1d1f] text-[#6b6b70]"
						aria-label={$LL.ui_increment()}
						><svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"><polyline points="18 15 12 9 6 15" /></svg
						></button
					>
					<button
						type="button"
						onclick={() => step(-1)}
						class="p-1 hover:text-[#1d1d1f] text-[#6b6b70]"
						aria-label={$LL.ui_decrement()}
						><svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="3"><polyline points="6 9 12 15 18 15" /></svg
						></button
					>
				</div>
			{/if}
		{/if}
	</div>
	{#if error}<p class="mt-1 text-[11px] text-red-500 font-medium">
			{error}
		</p>{/if}
	{#if hint && !error}<p class="mt-1 text-[11px] text-[#525257]">{hint}</p>{/if}
</div>

<style>
	.scrollbar-custom::-webkit-scrollbar {
		width: 2px;
	}
	.scrollbar-custom::-webkit-scrollbar-thumb {
		background: rgba(166, 173, 187, 0.3);
		border-radius: 10px;
	}
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
