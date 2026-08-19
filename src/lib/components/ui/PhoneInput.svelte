<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import {
		parsePhoneNumberFromString,
		getCountries,
		getCountryCallingCode
	} from 'libphonenumber-js';

	interface Props {
		value?: string;
		label?: string;
		placeholder?: string;
		id?: string;
		error?: string;
		hint?: string;
		required?: boolean;
		disabled?: boolean;
		className?: string;
		includeCountryCode?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		label = '',
		placeholder = '812 3456 7890',
		id = '',
		error = '',
		hint = '',
		required = false,
		disabled = false,
		className = '',
		includeCountryCode = true,
		onchange
	}: Props = $props();

	let actualId = $derived(id || `phone-${Math.random().toString(36).slice(2, 11)}`);

	let isOpen = $state(false);
	let containerRef: HTMLElement | undefined = $state();
	let searchTerm = $state('');

	const countries = getCountries();
	const countryData: { code: string; name: string; callingCode: string; flag: string }[] = countries
		.map((code) => {
			try {
				return {
					code,
					name: new Intl.DisplayNames(['id'], { type: 'region' }).of(code) || code,
					callingCode: getCountryCallingCode(code),
					flag: getFlag(code)
				};
			} catch {
				return null;
			}
		})
		.filter(Boolean)
		.sort((a, b) => (a!.name < b!.name ? -1 : 1)) as typeof countryData;

	let selectedCountry: (typeof countryData)[0] = $state(
		countryData.find((c) => c.code === 'ID') || countryData[0]
	);
	let displayValue = $state('');

	function getFlag(code: string): string {
		const codePoints = code
			.toUpperCase()
			.split('')
			.map((char) => 127397 + char.charCodeAt(0));
		return String.fromCodePoint(...codePoints);
	}

	function selectCountry(country: (typeof countryData)[0]) {
		selectedCountry = country;
		isOpen = false;
		searchTerm = '';
		updateValue();
	}

	function normalizeInternationalInput(input: string): string {
		const trimmed = input.trim();
		if (trimmed.startsWith('00')) return `+${trimmed.slice(2)}`;
		return trimmed;
	}

	function updateValue() {
		const raw = displayValue.trim();
		if (!raw) {
			value = '';
			onchange?.(value);
			return;
		}

		try {
			const parsed =
				raw.startsWith('+') || raw.startsWith('00')
					? parsePhoneNumberFromString(normalizeInternationalInput(raw))
					: parsePhoneNumberFromString(raw, selectedCountry.code as any);

			if (parsed?.country) {
				const matchedCountry = countryData.find((c) => c.code === parsed.country);
				if (matchedCountry) selectedCountry = matchedCountry;
			}

			if (parsed?.number) {
				value = includeCountryCode
					? parsed.number
					: parsed.nationalNumber || raw.replace(/\D/g, '');
			} else {
				const digits = raw.replace(/\D/g, '');
				value = includeCountryCode ? `+${selectedCountry.callingCode}${digits}` : digits;
			}
		} catch {
			const digits = raw.replace(/\D/g, '');
			value = includeCountryCode ? `+${selectedCountry.callingCode}${digits}` : digits;
		}
		onchange?.(value);
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const raw = target.value;

		if (!raw) {
			displayValue = '';
			updateValue();
			return;
		}

		if (raw.startsWith('+') || raw.startsWith('00')) {
			const parsed = parsePhoneNumberFromString(normalizeInternationalInput(raw));
			if (parsed?.country) {
				const matchedCountry = countryData.find((c) => c.code === parsed.country);
				if (matchedCountry) selectedCountry = matchedCountry;
			}

			displayValue = parsed?.nationalNumber || raw.replace(/\D/g, '');
			updateValue();
			return;
		}

		displayValue = raw.replace(/\D/g, '');
		updateValue();
	}

	function openDropdown() {
		if (!disabled) {
			isOpen = true;
			searchTerm = '';
		}
	}

	onMount(() => {
		parseInitialValue();

		const hide = (e: MouseEvent) => {
			if (containerRef && !containerRef.contains(e.target as Node)) {
				isOpen = false;
			}
		};
		document.addEventListener('click', hide);
		return () => document.removeEventListener('click', hide);
	});

	function parseInitialValue() {
		if (!value) {
			displayValue = '';
			return;
		}

		const normalized = normalizeInternationalInput(value);
		const parsed = parsePhoneNumberFromString(normalized);

		if (parsed?.country) {
			const matchedCountry = countryData.find((c) => c.code === parsed.country);
			if (matchedCountry) selectedCountry = matchedCountry;
			displayValue = parsed.nationalNumber || value.replace(/\D/g, '');
			return;
		}

		displayValue = value.replace(/\D/g, '');
	}

	function handleBlur() {
		updateValue();
	}

	let filteredCountries = $derived(
		countryData.filter(
			(c) =>
				c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				c.callingCode.includes(searchTerm) ||
				c.code.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);
</script>

<div
	class="w-full relative {className}"
	bind:this={containerRef}
	style="z-index: {isOpen ? 1000 : 1}"
>
	{#if label}
		<label for={actualId} class="block text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] mb-1.5">
			{label}
			{#if required}<span class="text-red-500 ml-0.5">*</span>{/if}
		</label>
	{/if}

	<div class="relative group">
		<div class="flex">
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					openDropdown();
				}}
				class="flex items-center gap-1.5 bg-[#f5f5f7] border border-r-0 border-black/8 rounded-l-xl px-3.5 py-3 hover:bg-[#e8e8ed] transition-all {disabled
					? 'opacity-50 cursor-not-allowed'
					: 'cursor-pointer'} {isOpen ? 'bg-white border-[#0071e3] ring-4 ring-[#0071e3]/10' : ''}"
			>
				<span class="text-base">{selectedCountry?.flag}</span>
				<span class="text-[#1d1d1f] font-semibold text-xs sm:text-sm">+{selectedCountry?.callingCode}</span>
				<svg class="w-3.5 h-3.5 text-[#6b6b70]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<input
				id={actualId}
				type="tel"
				inputmode="numeric"
				{placeholder}
				{disabled}
				value={displayValue}
				oninput={handleInput}
				onblur={handleBlur}
				onclick={(e) => e.stopPropagation()}
				class="flex-1 bg-[#f5f5f7] border border-black/8 rounded-r-xl rounded-l-none px-4 py-3 text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#6b6b70]/60 focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 focus:outline-none transition-all {error
					? 'border-red-500'
					: ''} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
			/>
		</div>

		{#if isOpen}
			<div
				transition:fly={{ y: -10, duration: 200 }}
				class="absolute left-0 top-full mt-2 w-72 max-h-80 bg-white border border-black/10 rounded-2xl shadow-xl overflow-hidden z-99999"
			>
				<div class="p-2 border-b border-black/5">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Cari negara..."
						class="w-full bg-[#f5f5f7] border border-black/5 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-none"
						onclick={(e) => e.stopPropagation()}
					/>
				</div>

				<div class="max-h-60 overflow-y-auto scrollbar-custom">
					{#each filteredCountries as country}
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								selectCountry(country);
							}}
							class="w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center gap-3 transition-colors {country.code ===
							selectedCountry?.code
								? 'bg-[#0071e3]/10 text-[#0071e3] font-semibold'
								: 'text-[#1d1d1f] hover:bg-[#f5f5f7]'}"
						>
							<span class="text-base">{country.flag}</span>
							<span class="flex-1 truncate">{country.name}</span>
							<span class="text-[#6b6b70] text-xs font-mono">+{country.callingCode}</span>
							{#if country.code === selectedCountry?.code}
								<svg
									class="w-4 h-4 text-[#0071e3]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2.5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							{/if}
						</button>
					{/each}

					{#if filteredCountries.length === 0}
						<div class="px-4 py-8 text-center text-[#6b6b70] text-xs">Tidak ditemukan</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if error}
		<p class="mt-1 text-[11px] text-red-500 font-medium">{error}</p>
	{/if}
	{#if hint && !error}
		<p class="mt-1 text-[11px] text-[#6b6b70]">{hint}</p>
	{/if}
</div>

<style>
	.scrollbar-custom::-webkit-scrollbar {
		width: 4px;
	}
	.scrollbar-custom::-webkit-scrollbar-thumb {
		background: rgba(166, 173, 187, 0.3);
		border-radius: 10px;
	}
	.scrollbar-custom::-webkit-scrollbar-track {
		background: transparent;
	}
</style>
