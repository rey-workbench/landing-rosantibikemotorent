<script lang="ts">
import { AsYouType, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { onMount } from 'svelte';
import 'flag-icons/css/flag-icons.min.css';

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
	onchange?: (val: string) => void;
}

let {
	value = $bindable(''),
	label = '',
	placeholder = '0812-3456-7890 atau +44 7911 123456',
	id = '',
	error = '',
	hint = '',
	required = false,
	disabled = false,
	className = '',
	onchange
}: Props = $props();

let actualId = $derived(id || `phone-${Math.random().toString(36).slice(2, 11)}`);
let currentCountry = $state('ID');
let formattedDisplay = $state('');

function processInput(input: string) {
	if (!input) {
		formattedDisplay = '';
		currentCountry = 'ID';
		value = '';
		onchange?.('');
		return;
	}

	const trimmed = input.trim();
	const asYouType = new AsYouType('ID');
	const formatted = asYouType.input(trimmed);
	const detectedCountry = asYouType.getCountry() || 'ID';
	const numberValue = asYouType.getNumberValue();

	currentCountry = detectedCountry;
	formattedDisplay = formatted;

	if (numberValue) {
		value = numberValue;
	} else {
		const cleanDigits = trimmed.replaceAll(/\D/g, '');
		if (cleanDigits.startsWith('0')) {
			value = `+62${cleanDigits.slice(1)}`;
		} else if (cleanDigits.startsWith('62')) {
			value = `+${cleanDigits}`;
		} else if (trimmed.startsWith('+')) {
			value = `+${cleanDigits}`;
		} else {
			value = `+62${cleanDigits}`;
		}
	}

	onchange?.(value);
}

function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
	processInput(e.currentTarget.value);
}

onMount(() => {
	if (value) {
		const parsed = parsePhoneNumberFromString(value);
		if (parsed) {
			currentCountry = parsed.country || 'ID';
			const asYouType = new AsYouType(currentCountry as any);
			formattedDisplay = asYouType.input(value);
		} else {
			processInput(value);
		}
	}
});

let callingCode = $derived.by(() => {
	try {
		return getCountryCallingCode(currentCountry as any);
	} catch {
		return '62';
	}
});
</script>

<div class="w-full relative {className}">
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
		<div
			class="flex items-center bg-[#f5f5f7] border border-black/8 rounded-xl focus-within:ring-4 focus-within:ring-apple-blue/10 focus-within:border-apple-blue transition-all {error
				? 'border-red-500'
				: ''}"
		>
			<!-- Auto-Detected Country Flag & Dialing Code -->
			<div class="flex items-center gap-2 pl-3.5 pr-2 py-3 select-none">
				<span class="fi fi-{currentCountry.toLowerCase()} rounded-xs shadow-xs text-base leading-none shrink-0"></span>
				<span class="text-[#1d1d1f] font-semibold text-xs sm:text-sm">+{callingCode}</span>
			</div>

			<!-- Single Auto-Detecting As-You-Type Input -->
			<input
				id={actualId}
				type="tel"
				inputmode="numeric"
				{placeholder}
				{disabled}
				value={formattedDisplay}
				oninput={handleInput}
				class="flex-1 bg-transparent pr-3.5 py-3 text-xs sm:text-sm font-medium text-[#1d1d1f] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>
	</div>

	{#if error}
		<p class="mt-1 text-[11px] text-red-500 font-medium">{error}</p>
	{/if}
	{#if hint && !error}
		<p class="mt-1 text-[11px] text-[#525257]">{hint}</p>
	{/if}
</div>
