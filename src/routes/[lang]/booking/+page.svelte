<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import { slide } from 'svelte/transition';
	import { goto, refreshAll } from '$app/navigation';
	import { page } from '$app/state';
	import { transaksiService } from '$lib/services';
	import { DEFAULTS } from '$lib/constants';
	import { websocketService } from '$lib/services/websocket';
	import type { UnitMotor, PriceCalculation } from '$lib/types';
	import TurnstileWidget from '$lib/components/ui/TurnstileWidget.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import PhoneInput from '$lib/components/ui/PhoneInput.svelte';
	import PopupError from '$lib/components/ui/PopupError.svelte';
	import { parsePhoneNumberFromString } from 'libphonenumber-js';
	import LL from '$i18n/i18n-svelte.js';
	import { SeoHead } from '$lib/components/seo';
	import { getMotorImage, handleImageError } from '$lib/utils/image';

	let { data } = $props();

	let turnstileToken = $state('');

	// State
	let availableMotors = $state<UnitMotor[]>(
		untrack(() => (data.availableMotors || []) as UnitMotor[])
	);

	let uniqueMotors = $derived.by(() => {
		const seen = new Set<string>();
		return availableMotors.filter((m) => {
			if (!m.jenisId || seen.has(m.jenisId)) return false;
			seen.add(m.jenisId);
			return true;
		});
	});

	let selectedUnit = $derived.by(() => {
		if (formData.unitId) {
			return availableMotors.find((m) => m.id === formData.unitId) || null;
		}
		if (formData.jenisId) {
			return availableMotors.find((m) => m.jenisId === formData.jenisId) || null;
		}
		return null;
	});

	let unsubs: (() => void)[] = [];

	$effect(() => {
		if (data.availableMotors) {
			availableMotors = data.availableMotors as UnitMotor[];
		}
	});

	let currentStep = $state(0);
	let maxCompletedStep = $state(0);

	// Form State
	let formData = $state({
		namaPenyewa: '',
		noWhatsapp: '',
		unitId: untrack(() => (data.selectedUnitFromUrl as any)?.id || ''),
		jenisId: untrack(() => (data.selectedUnitFromUrl as any)?.jenisId || ''),
		tanggalMulai: untrack(() => (data.defaultDates as any).mulai),
		tanggalSelesai: untrack(() => (data.defaultDates as any).selesai),
		jamMulai: DEFAULTS.RENTAL_START_TIME,
		jamSelesai: DEFAULTS.RENTAL_END_TIME,
		jasHujan: 0,
		helm: 0
	});

	let priceBreakdown: PriceCalculation | null = $state(null);
	let isCalculating = $state(false);
	let isSubmitting = $state(false);
	let formError = $state('');
	let success = $state(false);

	onMount(async () => {
		if (data.selectedUnitFromUrl) {
			handleCalculatePrice();
		}

		websocketService.connect();
		unsubs = [
			websocketService.onTransactionUpdate(() => refreshAll()),
			websocketService.onUnitMotorUpdate(() => refreshAll())
		];
	});

	function updateDateParams() {
		if (!formData.tanggalMulai || !formData.tanggalSelesai) return;
		const url = new URL(page.url);
		url.searchParams.set('mulai', formData.tanggalMulai);
		url.searchParams.set('selesai', formData.tanggalSelesai);
		goto(url, { keepFocus: true, noScroll: true, replaceState: true });
	}

	function handleDateChange() {
		updateDateParams();
		handleCalculatePrice();
	}

	onDestroy(() => {
		unsubs.forEach((unsub) => unsub());
	});

	async function handleCalculatePrice() {
		if (!formData.unitId && !formData.jenisId) return;
		if (!formData.tanggalMulai || !formData.tanggalSelesai) return;

		if (isCalculating) return;

		isCalculating = true;
		formError = '';

		try {
			const result = await transaksiService.calculatePrice({
				unitId: formData.unitId || undefined,
				jenisId: formData.jenisId || undefined,
				tanggalMulai: formData.tanggalMulai,
				tanggalSelesai: formData.tanggalSelesai,
				jamMulai: formData.jamMulai,
				jamSelesai: formData.jamSelesai,
				jasHujan: Number(formData.jasHujan),
				helm: Number(formData.helm)
			});
			priceBreakdown = result;
		} catch (err: any) {
			console.error('Price calculation failed:', err);
			formError =
				err?.response?.data?.userErrorMsg ||
				err?.response?.data?.message ||
				$LL.booking_error_price_calc();
			priceBreakdown = null;
		} finally {
			isCalculating = false;
		}
	}

	function validateStep(step: number): string | null {
		switch (step) {
			case 0:
				if (!formData.namaPenyewa.trim()) return $LL.booking_error_name_required();
				if (!formData.noWhatsapp.trim()) return $LL.booking_error_whatsapp_required();
				if (!isValidWhatsapp(formData.noWhatsapp)) return $LL.booking_error_whatsapp_invalid();
				return null;
			case 1:
				if (!formData.jenisId && !formData.unitId) return $LL.booking_error_motor_required();
				return null;
			case 2:
				if (!formData.tanggalMulai) return $LL.booking_error_start_date_required();
				if (!formData.tanggalSelesai) return $LL.booking_error_end_date_required();
				if (formData.tanggalSelesai < formData.tanggalMulai)
					return $LL.booking_error_date_invalid();
				return null;
			default:
				return null;
		}
	}

	function isValidWhatsapp(input: string): boolean {
		const value = input.trim();
		if (!value) return false;

		try {
			const normalized = value.startsWith('00') ? `+${value.slice(2)}` : value;
			// Pass 'ID' as default country code so local numbers like 0812... can be parsed
			const parsed = parsePhoneNumberFromString(normalized, 'ID');
			return !!parsed?.isValid();
		} catch {
			return false;
		}
	}

	async function handleSubmit() {
		isSubmitting = true;
		formError = '';

		try {
			const response = await transaksiService.create({
				namaPenyewa: formData.namaPenyewa,
				noWhatsapp: formData.noWhatsapp,
				unitId: formData.unitId || undefined,
				jenisId: formData.jenisId || undefined,
				tanggalMulai: formData.tanggalMulai,
				tanggalSelesai: formData.tanggalSelesai,
				jamMulai: formData.jamMulai,
				jamSelesai: formData.jamSelesai,
				jasHujan: formData.jasHujan,
				helm: formData.helm,
				turnstileToken
			});

			success = true;
			document.cookie = `booking_session=${response.id}; path=/; max-age=300; SameSite=Lax`;
			setTimeout(() => {
				goto(`/${lang}/booking/success`);
			}, 2000);
		} catch (err: any) {
			const errorCode = err?.response?.data?.errorCode;
			const backendErrorMsg =
				err?.response?.data?.userErrorMsg || err?.response?.data?.message || '';

			switch (errorCode) {
				case 'ERR_ACTIVE_BOOKING_EXISTS':
					formError = $LL.booking_error_active_exists();
					break;
				case 'ERR_BOOKING_OVERLAP':
					formError = $LL.booking_error_overlap();
					break;
				case 'ERR_MODEL_FULLY_BOOKED':
					formError = $LL.booking_error_fully_booked();
					break;
				case 'ERR_TURNSTILE_FAILED':
					formError = $LL.booking_error_turnstile_failed();
					break;
				default:
					formError = backendErrorMsg || $LL.booking_error_create();
			}
		} finally {
			isSubmitting = false;
		}
	}

	function handleMotorSelect(jenisId: string) {
		formData.jenisId = jenisId;
		formData.unitId = '';
		handleCalculatePrice();
	}

	let lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	let currentUrl = $derived(page.url.href);
</script>

<SeoHead
	{lang}
	meta={{
		title: `${$LL.page_title_booking()} | Rosantibike Motorent`,
		description: $LL.booking_header_subtitle(),
		ogType: 'website',
		canonicalUrl: currentUrl
	}}
/>

<main class="bg-white min-h-screen pt-16 md:pt-20 pb-16 px-4 sm:px-6 md:px-8">
	<div class="max-w-3xl mx-auto">
		<!-- Header (Exact Fleet / Rosantibike Typography) -->
		<div class="mb-6 md:mb-8 text-center">
			<h1
				class="text-[36px] md:text-[44px] leading-[1.05] font-semibold font-display text-[#1d1d1f] tracking-tight"
			>
				{$LL.booking_header_order()}
				{$LL.booking_header_motor()}
			</h1>
			<p
				class="text-[15px] sm:text-[16px] text-[#6e6e73] font-normal mt-2.5 max-w-lg mx-auto leading-relaxed"
			>
				{$LL.booking_header_subtitle()}
			</p>
		</div>

		{#if success}
			<!-- Success Message -->
			<div
				class="bg-white border border-black/6 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center"
			>
				<div
					class="w-16 h-16 bg-[#e8f3ff] rounded-full flex items-center justify-center mx-auto mb-5 text-apple-blue"
				>
					<svg
						class="w-8 h-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2.5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-[#1d1d1f] mb-2">{$LL.booking_success_title()}</h2>
				<p class="text-[#525257] text-sm leading-relaxed max-w-md mx-auto">
					{$LL.booking_success_message()}
				</p>
			</div>
		{:else}
			<!-- Accordion Wizard -->
			<div
				class="bg-white border border-black/6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
			>
				<!-- Popup Error Toast -->
				{#if formError}
					<div class="p-4 sm:p-6 border-b border-black/6">
						<PopupError error={formError} onClose={() => (formError = '')} />
					</div>
				{/if}

				<!-- Step 1: Data Diri -->
				<div class="border-b border-black/6">
					<button
						type="button"
						class="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors {currentStep ===
						0
							? 'bg-[#f5f5f7]/50'
							: 'bg-white hover:bg-[#f5f5f7]/30'} {maxCompletedStep < 0
							? 'opacity-50 cursor-not-allowed'
							: 'cursor-pointer'}"
						onclick={() => {
							if (maxCompletedStep >= 0) {
								currentStep = 0;
								formError = '';
							}
						}}
					>
						<div class="flex items-center gap-4">
							<div
								class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold {currentStep ===
								0
									? 'bg-apple-blue text-white shadow-sm'
									: maxCompletedStep > 0
										? 'bg-black text-white'
										: 'bg-[#f5f5f7] text-[#6b6b70] border border-black/5'}"
							>
								{#if maxCompletedStep > 0 && currentStep !== 0}
									<svg
										class="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2.5"
										><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg
									>
								{:else}
									1
								{/if}
							</div>
							<div>
								<h2 class="text-base sm:text-lg font-bold text-[#1d1d1f]">
									{$LL.booking_steps_personal_title()}
								</h2>
								{#if currentStep !== 0 && maxCompletedStep > 0 && formData.namaPenyewa}
									<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
										{formData.namaPenyewa} • {formData.noWhatsapp}
									</p>
								{:else}
									<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
										{$LL.booking_steps_personal_desc()}
									</p>
								{/if}
							</div>
						</div>
					</button>

					{#if currentStep === 0}
						<div transition:slide={{ duration: 300 }} class="px-5 sm:px-6 pb-6 space-y-5">
							<Input
								id="nama-penyewa"
								label={$LL.booking_name_label()}
								bind:value={formData.namaPenyewa}
								required
								placeholder={$LL.booking_name_placeholder()}
								icon="user"
							/>
							<PhoneInput
								id="no-whatsapp"
								label={$LL.booking_whatsapp_label()}
								bind:value={formData.noWhatsapp}
								required
								placeholder={$LL.booking_whatsapp_placeholder()}
								hint={$LL.booking_whatsapp_hint()}
							/>

							<div class="mt-6 pt-5 border-t border-black/6">
								<Button
									variant="primary"
									size="md"
									onclick={() => {
										const err = validateStep(0);
										if (err) {
											formError = err;
											return;
										}
										formError = '';
										maxCompletedStep = Math.max(maxCompletedStep, 1);
										currentStep = 1;
									}}
									fullWidth={true}
								>
									{$LL.booking_next()}
									<svg
										class="w-4 h-4 ml-1.5 inline"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
										><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
									>
								</Button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Step 2: Pilih Motor -->
				<div class="border-b border-black/6">
					<button
						type="button"
						class="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors {currentStep ===
						1
							? 'bg-[#f5f5f7]/50'
							: 'bg-white hover:bg-[#f5f5f7]/30'} {maxCompletedStep < 1
							? 'opacity-50 cursor-not-allowed'
							: 'cursor-pointer'}"
						onclick={() => {
							if (maxCompletedStep >= 1) {
								currentStep = 1;
								formError = '';
							}
						}}
						disabled={maxCompletedStep < 1}
					>
						<div class="flex items-center gap-4">
							<div
								class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold {currentStep ===
								1
									? 'bg-apple-blue text-white shadow-sm'
									: maxCompletedStep > 1
										? 'bg-black text-white'
										: 'bg-[#f5f5f7] text-[#6b6b70] border border-black/5'}"
							>
								{#if maxCompletedStep > 1 && currentStep !== 1}
									<svg
										class="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2.5"
										><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg
									>
								{:else}
									2
								{/if}
							</div>
							<div>
								<h2 class="text-base sm:text-lg font-bold text-[#1d1d1f]">
									{$LL.booking_steps_motor_title()}
								</h2>
								{#if currentStep !== 1 && maxCompletedStep > 1 && selectedUnit}
									<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
										{selectedUnit.jenis?.merk}
										{selectedUnit.jenis?.model}
									</p>
								{:else}
									<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
										{$LL.booking_steps_motor_desc()}
									</p>
								{/if}
							</div>
						</div>
					</button>

					{#if currentStep === 1}
						<div transition:slide={{ duration: 300 }} class="px-5 sm:px-6 pb-6">
							<div
								class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-105 overflow-y-auto pr-1 pb-1"
							>
								{#each uniqueMotors as motor}
									{@const jenis = motor.jenis}
									{@const isSelected = formData.jenisId === motor.jenisId}
									<button
										type="button"
										onclick={() => handleMotorSelect(motor.jenisId)}
										class="p-4 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer relative group {isSelected
											? 'bg-blue-50/40 border-apple-blue ring-2 ring-apple-blue/20 shadow-sm'
											: 'bg-[#f5f5f7] border-black/5 hover:bg-[#e8e8ed] hover:border-black/10'}"
									>
										<div
											class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-black/5"
										>
											{#if getMotorImage(jenis)}
												<img
													src={getMotorImage(jenis)}
													onerror={handleImageError}
													alt={jenis?.model}
													width="80"
													height="80"
													class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
												/>
											{/if}
										</div>
										<div class="flex-1 min-w-0">
											<span
												class="text-[10px] font-semibold uppercase tracking-wider text-[#525257]"
												>{jenis?.merk}</span
											>
											<h3 class="text-[14px] sm:text-[15px] font-bold text-[#1d1d1f] truncate">
												{jenis?.model}
											</h3>
											<span class="text-sm font-semibold tracking-tight text-[#1d1d1f]">
												{$LL.format_currency(jenis?.hargaSewa || 0)}<span
													class="text-[#86868b] font-normal">/{$LL.booking_day()}</span
												>
											</span>
										</div>
										{#if isSelected}
											<div
												class="absolute top-3 right-3 w-5 h-5 bg-apple-blue text-white rounded-full flex items-center justify-center shadow-xs"
											>
												<svg
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg
												>
											</div>
										{/if}
									</button>
								{/each}
							</div>

							<div class="mt-6 pt-5 border-t border-black/6">
								<Button
									variant="primary"
									size="md"
									onclick={() => {
										const err = validateStep(1);
										if (err) {
											formError = err;
											return;
										}
										formError = '';
										maxCompletedStep = Math.max(maxCompletedStep, 2);
										currentStep = 2;
									}}
									fullWidth={true}
								>
									{$LL.booking_next()}
									<svg
										class="w-4 h-4 ml-1.5 inline"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
										><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
									>
								</Button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Step 3: Waktu Sewa -->
				<div class="border-b border-black/6">
					<button
						type="button"
						class="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors {currentStep ===
						2
							? 'bg-[#f5f5f7]/50'
							: 'bg-white hover:bg-[#f5f5f7]/30'} {maxCompletedStep < 2
							? 'opacity-50 cursor-not-allowed'
							: 'cursor-pointer'}"
						onclick={() => {
							if (maxCompletedStep >= 2) {
								currentStep = 2;
								formError = '';
							}
						}}
						disabled={maxCompletedStep < 2}
					>
						<div class="flex items-center gap-4">
							<div
								class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold {currentStep ===
								2
									? 'bg-apple-blue text-white shadow-sm'
									: maxCompletedStep > 2
										? 'bg-black text-white'
										: 'bg-[#f5f5f7] text-[#6b6b70] border border-black/5'}"
							>
								{#if maxCompletedStep > 2 && currentStep !== 2}
									<svg
										class="w-5 h-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2.5"
										><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg
									>
								{:else}
									3
								{/if}
							</div>
							<div>
								<h2 class="text-base sm:text-lg font-bold text-[#1d1d1f]">
									{$LL.booking_steps_time_title()}
								</h2>
								{#if currentStep !== 2 && maxCompletedStep > 2 && formData.tanggalMulai}
									<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
										{$LL.format_date_short(new Date(formData.tanggalMulai))} - {$LL.format_date_short(
											new Date(formData.tanggalSelesai)
										)}
									</p>
								{:else}
									<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
										{$LL.booking_steps_time_desc()}
									</p>
								{/if}
							</div>
						</div>
					</button>

					{#if currentStep === 2}
						<div transition:slide={{ duration: 300 }} class="px-5 sm:px-6 pb-6 space-y-5">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<Input
									id="tanggal-mulai"
									label={$LL.booking_start_date_label()}
									type="date"
									bind:value={formData.tanggalMulai}
									onchange={handleDateChange}
									required
								/>
								<Input
									id="jam-mulai"
									label={$LL.booking_start_time_label()}
									type="time"
									bind:value={formData.jamMulai}
									onchange={handleCalculatePrice}
									required
								/>
								<Input
									id="tanggal-selesai"
									label={$LL.booking_end_date_label()}
									type="date"
									bind:value={formData.tanggalSelesai}
									onchange={handleDateChange}
									required
								/>
								<Input
									id="jam-selesai"
									label={$LL.booking_end_time_label()}
									type="time"
									bind:value={formData.jamSelesai}
									onchange={handleCalculatePrice}
									required
								/>
							</div>

							<div class="border-t border-black/8 pt-4 sm:pt-5">
								<div class="flex items-center justify-between mb-4">
									<h4 class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
										{$LL.booking_accessories_label()}
									</h4>
									<span class="text-xs text-apple-blue font-medium flex items-center gap-1"
										><svg
											class="w-3.5 h-3.5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
											><path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M5 13l4 4L19 7"
											/></svg
										>{$LL.booking_accessories_free()}</span
									>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
									<!-- Jas Hujan Card -->
									<div
										class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-between"
									>
										<div>
											<p class="text-sm font-semibold text-[#1d1d1f]">
												{$LL.booking_raincoat_label()}
											</p>
										</div>
										<div
											class="flex items-center gap-1 bg-white border border-black/8 rounded-xl p-1 shadow-xs"
										>
											<button
												type="button"
												disabled={formData.jasHujan <= 0}
												onclick={() => {
													formData.jasHujan = Math.max(0, formData.jasHujan - 1);
													handleCalculatePrice();
												}}
												class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f5f5f7]"
												>-</button
											>
											<span class="w-6 text-center text-xs font-bold">{formData.jasHujan}</span>
											<button
												type="button"
												disabled={formData.jasHujan >= 2}
												onclick={() => {
													formData.jasHujan = Math.min(2, formData.jasHujan + 1);
													handleCalculatePrice();
												}}
												class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f5f5f7]"
												>+</button
											>
										</div>
									</div>

									<!-- Helm Card -->
									<div
										class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-between"
									>
										<div>
											<p class="text-sm font-semibold text-[#1d1d1f]">
												{$LL.booking_helmet_label()}
											</p>
										</div>
										<div
											class="flex items-center gap-1 bg-white border border-black/8 rounded-xl p-1 shadow-xs"
										>
											<button
												type="button"
												disabled={formData.helm <= 0}
												onclick={() => {
													formData.helm = Math.max(0, formData.helm - 1);
													handleCalculatePrice();
												}}
												class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f5f5f7]"
												>-</button
											>
											<span class="w-6 text-center text-xs font-bold">{formData.helm}</span>
											<button
												type="button"
												disabled={formData.helm >= 2}
												onclick={() => {
													formData.helm = Math.min(2, formData.helm + 1);
													handleCalculatePrice();
												}}
												class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f5f5f7]"
												>+</button
											>
										</div>
									</div>
								</div>
							</div>

							<div class="mt-6 pt-5 border-t border-black/6">
								<Button
									variant="primary"
									size="md"
									onclick={async () => {
										const err = validateStep(2);
										if (err) {
											formError = err;
											return;
										}

										if (!priceBreakdown) {
											await handleCalculatePrice();
											if (formError) return;
										}

										formError = '';
										maxCompletedStep = Math.max(maxCompletedStep, 3);
										currentStep = 3;
									}}
									fullWidth={true}
									loading={isCalculating}
									disabled={isCalculating}
								>
									{$LL.booking_next()}
									<svg
										class="w-4 h-4 ml-1.5 inline"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
										><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg
									>
								</Button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Step 4: Konfirmasi -->
				<div>
					<button
						type="button"
						class="w-full p-5 sm:p-6 flex items-center justify-between text-left transition-colors {currentStep ===
						3
							? 'bg-[#f5f5f7]/50'
							: 'bg-white hover:bg-[#f5f5f7]/30'} {maxCompletedStep < 3
							? 'opacity-50 cursor-not-allowed'
							: 'cursor-pointer'}"
						onclick={() => {
							if (maxCompletedStep >= 3) {
								currentStep = 3;
								formError = '';
							}
						}}
						disabled={maxCompletedStep < 3}
					>
						<div class="flex items-center gap-4">
							<div
								class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold {currentStep ===
								3
									? 'bg-apple-blue text-white shadow-sm'
									: 'bg-[#f5f5f7] text-[#6b6b70] border border-black/5'}"
							>
								4
							</div>
							<div>
								<h2 class="text-base sm:text-lg font-bold text-[#1d1d1f]">
									{$LL.booking_steps_confirm_title()}
								</h2>
								<p class="text-xs sm:text-sm text-[#6e6e73] mt-0.5">
									{$LL.booking_steps_confirm_desc()}
								</p>
							</div>
						</div>
					</button>

					{#if currentStep === 3}
						<div transition:slide={{ duration: 300 }} class="px-5 sm:px-6 pb-6">
							<!-- Price & Summary -->
							{#if priceBreakdown}
								<div class="space-y-4 mb-6">
									<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-5 space-y-2.5">
										<h3
											class="text-[10px] font-semibold text-[#525257] uppercase tracking-wider mb-2"
										>
											{$LL.booking_price_breakdown()}
										</h3>
										<div class="space-y-2 text-xs sm:text-sm">
											<div class="flex justify-between items-center">
												<div class="flex items-center gap-2">
													<span class="w-1.5 h-1.5 rounded-full bg-apple-blue"></span>
													<p class="text-[#525257] text-[13px]">
														{$LL.booking_rental_cost()} ({priceBreakdown.rincian.jumlahHari}
														{$LL.booking_day()} × {$LL.format_currency(
															priceBreakdown.rincian.hargaPerHari
														)})
													</p>
												</div>
												<p class="text-[#1d1d1f] text-sm">
													{$LL.format_currency(
														priceBreakdown.rincian.jumlahHari * priceBreakdown.rincian.hargaPerHari
													)}
												</p>
											</div>
											{#if priceBreakdown.rincian.jamTambahan > 0}
												<div class="flex justify-between items-center py-2">
													<div class="flex items-center gap-2">
														<span class="w-1.5 h-1.5 rounded-full bg-apple-blue"></span>
														<p class="text-[#525257] text-[13px]">
															{$LL.booking_additional_fee()} ({priceBreakdown.rincian.jamTambahan} jam
															× {$LL.format_currency(priceBreakdown.rincian.dendaPerJam)})
														</p>
													</div>
													<p class="text-[#1d1d1f] text-sm">
														{$LL.format_currency(
															priceBreakdown.rincian.jamTambahan *
																priceBreakdown.rincian.dendaPerJam
														)}
													</p>
												</div>
											{/if}
											<div class="text-[11px] text-[#525257] pt-2 border-t border-black/5">
												{$LL.booking_total_duration()}: {priceBreakdown.rincian.totalJam} jam
											</div>
										</div>
									</div>

									<div
										class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-6 flex justify-between items-center"
									>
										<p class="text-[#525257] text-xs font-semibold tracking-wider uppercase mb-0.5">
											{$LL.booking_total_cost()}
										</p>
										<p class="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
											{$LL.format_currency(priceBreakdown.totalBiaya)}
										</p>
									</div>
								</div>
							{:else}
								<div
									class="bg-white border border-black/5 rounded-3xl p-6 text-center shadow-xs mb-6"
								>
									<p class="text-[#525257] text-xs">{$LL.booking_calculating()}</p>
								</div>
							{/if}

							<!-- Note -->
							<div
								class="bg-[#f5f5f7] rounded-2xl p-4 sm:p-5 flex gap-3.5 border border-black/5 mb-6"
							>
								<svg
									class="w-5 h-5 text-apple-blue shrink-0 mt-0.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/></svg
								>
								<div class="text-xs sm:text-sm">
									<p class="text-[#1d1d1f] font-semibold">{$LL.booking_note_title()}</p>
									<p class="text-[#6b6b70] mt-0.5 leading-relaxed">{$LL.booking_note_desc()}</p>
								</div>
							</div>

							<div class="flex justify-center mb-6">
								<TurnstileWidget
									sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
									onToken={(token) => (turnstileToken = token)}
								/>
							</div>

							<Button
								variant="primary"
								size="md"
								onclick={handleSubmit}
								loading={isSubmitting || isCalculating}
								disabled={isSubmitting || isCalculating || !turnstileToken}
								fullWidth={true}
							>
								<div class="flex items-center justify-center gap-2">
									{#if isSubmitting || isCalculating}<span
											class="loading loading-spinner loading-sm"
										></span>{/if}
									{isSubmitting ? $LL.booking_processing() : $LL.booking_confirm()}
								</div>
							</Button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
</style>
