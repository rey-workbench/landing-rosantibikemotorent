<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import {
		parsePhoneNumberFromString,
		getCountries,
		getCountryCallingCode
	} from 'libphonenumber-js';

	export let value: string = '';
	export let label = '';
	export let placeholder = '812 3456 7890';
	export let id = '';
	export let error = '';
	export let hint = '';
	export let required = false;
	export let disabled = false;
	export let className = '';
	export let includeCountryCode = true;

	$: actualId = id || `phone-${Math.random().toString(36).slice(2, 11)}`;

	const dispatch = createEventDispatcher();
	let isOpen = false;
	let containerRef: HTMLElement;
	let searchTerm = '';

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

	let selectedCountry: (typeof countryData)[0] =
		countryData.find((c) => c.code === 'ID') || countryData[0];
	let displayValue = '';
	let isInitialized = false;

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
			dispatch('change', { value });
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
		dispatch('change', { value });
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
		isInitialized = true;

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

	$: filteredCountries = countryData.filter(
		(c) =>
			c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			c.callingCode.includes(searchTerm) ||
			c.code.toLowerCase().includes(searchTerm.toLowerCase())
	);

	$: displayNumber = displayValue ? `+${selectedCountry.callingCode} ${displayValue}` : '';
</script>

<div
	class="w-full relative {className}"
	bind:this={containerRef}
	style="z-index: {isOpen ? 1000 : 1}"
>
	{#if label}
		<label for={actualId} class="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
			{label}
			{#if required}<span class="text-red-500 ml-1">*</span>{/if}
		</label>
	{/if}

	<div class="relative group">
		<div class="flex">
			<button
				type="button"
				on:click|stopPropagation={openDropdown}
				class="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] border border-r-0 border-[rgba(166,173,187,0.2)] rounded-l-xl px-3 py-3 hover:bg-[rgba(255,255,255,0.08)] transition-all {disabled
					? 'opacity-50 cursor-not-allowed'
					: 'cursor-pointer'} {isOpen ? 'bg-[rgba(108,160,255,0.08)] border-accent-soft' : ''}"
			>
				<span class="text-lg">{selectedCountry?.flag}</span>
				<span class="text-white font-medium">+{selectedCountry?.callingCode}</span>
				<svg class="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
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
				on:input={handleInput}
				on:blur={handleBlur}
				on:click|stopPropagation={() => {}}
				class="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(166,173,187,0.2)] rounded-r-xl rounded-l-none px-4 py-3 text-white placeholder-[rgba(166,173,187,0.7)] focus-visible:focus-ring focus:bg-[rgba(108,160,255,0.08)] transition-all {error
					? 'border-red-500'
					: ''} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
			/>
		</div>

		{#if isOpen}
			<div
				transition:fly={{ y: -10, duration: 200 }}
				class="absolute left-0 top-full mt-2 w-72 max-h-80 bg-[rgba(9,11,14,0.98)] border border-[rgba(166,173,187,0.2)] rounded-xl shadow-2xl overflow-hidden z-[99999]"
			>
				<div class="p-2 border-b border-[rgba(166,173,187,0.12)]">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Cari negara..."
						class="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(166,173,187,0.2)] rounded-lg px-3 py-2 text-sm text-white placeholder-[rgba(166,173,187,0.7)] focus-visible:focus-ring"
						on:click|stopPropagation={() => {}}
					/>
				</div>

				<div class="max-h-60 overflow-y-auto scrollbar-custom">
					{#each filteredCountries as country}
						<button
							type="button"
							on:click|stopPropagation={() => selectCountry(country)}
							class="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 {country.code ===
							selectedCountry?.code
								? 'bg-white/10 text-white'
								: 'text-muted hover:bg-[rgba(108,160,255,0.12)] hover:text-white'}"
						>
							<span class="text-lg">{country.flag}</span>
							<span class="flex-1 truncate">{country.name}</span>
							<span class="text-muted text-xs">+{country.callingCode}</span>
							{#if country.code === selectedCountry?.code}
								<svg
									class="w-4 h-4 text-green-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							{/if}
						</button>
					{/each}

					{#if filteredCountries.length === 0}
						<div class="px-4 py-8 text-center text-muted text-sm">Tidak ditemukan</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if error}
		<p class="mt-1 text-[10px] text-red-500 uppercase font-bold tracking-wider">{error}</p>
	{/if}
	{#if hint && !error}
		<p class="mt-1 text-[10px] text-muted">{hint}</p>
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
