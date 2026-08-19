<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import { goto, refreshAll } from '$app/navigation';
	import { page } from '$app/state';
	import { transaksiService } from '$lib/services';
	import { DEFAULTS } from '$lib/constants';
	import { websocketService } from '$lib/services/websocket';
	import type { UnitMotor, PriceCalculation } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import PhoneInput from '$lib/components/ui/PhoneInput.svelte';
	import StepIndicator from '$lib/components/ui/StepIndicator.svelte';
	import { parsePhoneNumberFromString } from 'libphonenumber-js';
	import LL from '$i18n/i18n-svelte.js';
	import { SeoHead } from '$lib/components/seo';
	import { formatCurrency } from '$lib/utils/format';
	import { getFallbackImage, getMotorImage, handleImageError } from '$lib/utils/image';

	let { data } = $props();

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

	function nextStep() {
		const error = validateStep(currentStep);
		if (error) {
			formError = error;
			return;
		}
		formError = '';
		if (currentStep < steps.length - 1) {
			currentStep++;
			if (currentStep === 2) handleCalculatePrice();
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
			formError = '';
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
				helm: formData.helm
			});

			success = true;
			setTimeout(() => {
				goto(`/${lang}/booking/success?id=${response.id}`);
			}, 2000);
		} catch (err: any) {
			formError =
				err?.response?.data?.userErrorMsg ||
				err?.response?.data?.message ||
				$LL.booking_error_create();
		} finally {
			isSubmitting = false;
		}
	}

	function handleMotorSelect(jenisId: string) {
		formData.jenisId = jenisId;
		formData.unitId = '';
		handleCalculatePrice();
	}

	function formatDate(dateStr: string): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	let lang = $derived((page.params.lang || 'id') as 'id' | 'en');
	let currentUrl = $derived(page.url.href);
	$effect(() => {
		const seen = new Set();
		uniqueMotors = availableMotors.filter((m) => {
			const key = `${m.jenisId}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	});
	$effect(() => {
		if (formData.jenisId) {
			selectedUnit =
				availableMotors.find((m) => (m.jenisId || m.jenis?.id) === formData.jenisId) || null;
		} else if (formData.unitId) {
			selectedUnit = availableMotors.find((m) => m.id === formData.unitId) || null;
		} else {
			selectedUnit = null;
		}
	});
	// Steps configuration
	let steps = $derived([
		{ title: $LL.booking_steps_personal_title(), description: $LL.booking_steps_personal_desc() },
		{ title: $LL.booking_steps_motor_title(), description: $LL.booking_steps_motor_desc() },
		{ title: $LL.booking_steps_time_title(), description: $LL.booking_steps_time_desc() },
		{ title: $LL.booking_steps_confirm_title(), description: $LL.booking_steps_confirm_desc() }
	]);
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

<main class="bg-white min-h-screen pt-20 md:pt-24 pb-24 px-4 sm:px-6 md:px-8">
	<div class="max-w-3xl mx-auto">
		<!-- Header (Exact Fleet / Rosantibike Typography) -->
		<div class="mb-10 text-center">
			<h1
				class="text-[36px] sm:text-[44px] md:text-[48px] leading-[1.05] font-semibold text-[#1d1d1f] tracking-tight"
			>
				{$LL.booking_header_order()} {$LL.booking_header_motor()}
			</h1>
			<p class="text-[15px] sm:text-[16px] text-[#6b6b70] font-normal mt-2.5 max-w-lg mx-auto leading-relaxed">
				{$LL.booking_header_subtitle()}
			</p>
		</div>

		{#if success}
			<!-- Success Message -->
			<div
				class="bg-white border border-black/6 rounded-3xl p-8 sm:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center"
			>
				<div
					class="w-16 h-16 bg-[#e8f3ff] rounded-full flex items-center justify-center mx-auto mb-5 text-[#0071e3]"
				>
					<svg
						class="w-8 h-8"
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
				</div>
				<h3 class="text-2xl font-bold text-[#1d1d1f] mb-2">{$LL.booking_success_title()}</h3>
				<p class="text-[#6b6b70] text-sm leading-relaxed max-w-md mx-auto">{$LL.booking_success_message()}</p>
			</div>
		{:else}
			<!-- Step Indicator -->
			<StepIndicator {steps} {currentStep} />

			<!-- Form Card -->
			<div
				class="bg-white border border-black/6 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
			>
				{#if formError}
					<div
						class="bg-red-50 border border-red-200/80 rounded-2xl p-4 mb-6 flex items-center gap-3"
					>
						<svg
							class="w-5 h-5 text-red-500 shrink-0"
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
						<p class="text-red-700 text-xs sm:text-sm font-medium">{formError}</p>
					</div>
				{/if}

				<!-- Step 1: Data Diri -->
				{#if currentStep === 0}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-[#1d1d1f]">{$LL.booking_step1_title()}</h3>
							<p class="text-[#6b6b70] text-xs sm:text-sm mt-1">{$LL.booking_step1_desc()}</p>
						</div>

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
					</div>
				{/if}

				<!-- Step 2: Pilih Motor (Visual Interactive Grid) -->
				{#if currentStep === 1}
					<div class="space-y-5 animate-fadeIn">
						<div class="text-center mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-[#1d1d1f]">Pilih Motor</h3>
							<p class="text-[#6b6b70] text-xs sm:text-sm mt-1">Pilih armada yang ingin Anda sewa</p>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-105 overflow-y-auto pr-1 pb-1">
							{#each uniqueMotors as motor}
								{@const jenis = motor.jenis}
								{@const isSelected = formData.jenisId === motor.jenisId}
								<button
									type="button"
									onclick={() => handleMotorSelect(motor.jenisId)}
									class="p-4 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer relative group {isSelected
										? 'bg-blue-50/40 border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
										: 'bg-[#f5f5f7] border-black/5 hover:bg-[#e8e8ed] hover:border-black/10'}"
								>
									<div class="w-20 h-20 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-black/5">
										{#if getMotorImage(jenis)}
											<img
												src={getMotorImage(jenis)}
												data-fallback={getFallbackImage(jenis)}
												onerror={handleImageError}
												alt={jenis?.model}
												width="80"
												height="80"
												class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
											/>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<span class="text-[10px] font-semibold uppercase tracking-wider text-[#6b6b70]">{jenis?.merk}</span>
										<h4 class="text-[15px] font-bold text-[#1d1d1f] truncate">{jenis?.model}</h4>
										{#if jenis?.cc}
											<p class="text-[11px] text-[#6b6b70] mt-0.5">{jenis.cc} CC • Matic</p>
										{/if}
										<p class="text-[13px] font-semibold text-[#0071e3] mt-1.5">
											{formatCurrency(jenis?.hargaSewa || 0)} <span class="text-[11px] text-[#6b6b70] font-normal">/{$LL.booking_day()}</span>
										</p>
									</div>
									{#if isSelected}
										<div class="absolute top-3 right-3 w-5 h-5 bg-[#0071e3] text-white rounded-full flex items-center justify-center shadow-xs">
											<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
												<polyline points="20 6 9 17 4 12" />
											</svg>
										</div>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Step 3: Waktu Sewa & Aksesoris -->
				{#if currentStep === 2}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-[#1d1d1f]">{$LL.booking_step3_title()}</h3>
							<p class="text-[#6b6b70] text-xs sm:text-sm mt-1">{$LL.booking_step3_desc()}</p>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

						<div class="border-t border-black/8 pt-6">
							<div class="flex items-center justify-between mb-4">
								<h4 class="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
									{$LL.booking_accessories_label()}
								</h4>
								<span class="text-xs text-[#0071e3] font-medium flex items-center gap-1">
									<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									{$LL.booking_accessories_free()}
								</span>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
								<!-- Jas Hujan Card -->
								<div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-between">
									<div>
										<p class="text-sm font-semibold text-[#1d1d1f]">{$LL.booking_raincoat_label()}</p>
										<p class="text-xs text-[#6b6b70] mt-0.5">Jas hujan ponco/setelan</p>
									</div>
									<div class="flex items-center gap-1 bg-white border border-black/8 rounded-xl p-1 shadow-xs">
										<button
											type="button"
											disabled={formData.jasHujan <= 0}
											onclick={() => { formData.jasHujan = Math.max(0, formData.jasHujan - 1); handleCalculatePrice(); }}
											class="w-7 h-7 rounded-lg flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none transition-colors"
										>-</button>
										<span class="w-6 text-center text-xs font-bold text-[#1d1d1f]">{formData.jasHujan}</span>
										<button
											type="button"
											disabled={formData.jasHujan >= 2}
											onclick={() => { formData.jasHujan = Math.min(2, formData.jasHujan + 1); handleCalculatePrice(); }}
											class="w-7 h-7 rounded-lg flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none transition-colors"
										>+</button>
									</div>
								</div>

								<!-- Helm Card -->
								<div class="p-4 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-between">
									<div>
										<p class="text-sm font-semibold text-[#1d1d1f]">{$LL.booking_helmet_label()}</p>
										<p class="text-xs text-[#6b6b70] mt-0.5">Helm SNI bersih & wangi</p>
									</div>
									<div class="flex items-center gap-1 bg-white border border-black/8 rounded-xl p-1 shadow-xs">
										<button
											type="button"
											disabled={formData.helm <= 0}
											onclick={() => { formData.helm = Math.max(0, formData.helm - 1); handleCalculatePrice(); }}
											class="w-7 h-7 rounded-lg flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none transition-colors"
										>-</button>
										<span class="w-6 text-center text-xs font-bold text-[#1d1d1f]">{formData.helm}</span>
										<button
											type="button"
											disabled={formData.helm >= 2}
											onclick={() => { formData.helm = Math.min(2, formData.helm + 1); handleCalculatePrice(); }}
											class="w-7 h-7 rounded-lg flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] disabled:opacity-30 disabled:pointer-events-none transition-colors"
										>+</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 4: Konfirmasi & Rincian -->
				{#if currentStep === 3}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-6">
							<h3 class="text-lg sm:text-xl font-bold text-[#1d1d1f]">{$LL.booking_step4_title()}</h3>
							<p class="text-[#6b6b70] text-xs sm:text-sm mt-1">{$LL.booking_step4_desc()}</p>
						</div>

						<!-- Summary Card -->
						<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl overflow-hidden mb-6">
							<!-- Motor Info -->
							{#if selectedUnit}
								{@const jenis = selectedUnit.jenis}
								<div class="p-5 flex items-center gap-4 border-b border-black/5 bg-white">
									{#if getMotorImage(jenis)}
										<img
											loading="lazy"
											decoding="async"
											src={getMotorImage(jenis)}
											data-fallback={getFallbackImage(jenis)}
											onerror={handleImageError}
											alt={jenis?.model || 'Motor'}
											width="64"
											height="64"
											class="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl shrink-0"
										/>
									{/if}
									<div>
										<p
											class="text-[#6b6b70] text-[10px] font-semibold tracking-wider uppercase mb-0.5"
										>
											{$LL.booking_motor_label()}
										</p>
										<p class="text-[#1d1d1f] font-bold text-base">{jenis?.merk} {jenis?.model}</p>
									</div>
								</div>
							{:else if formData.jenisId || formData.unitId}
								<div class="p-5 border-b border-black/5 bg-white">
									<p class="text-[#6b6b70] text-[10px] font-semibold tracking-wider uppercase mb-0.5">
										{$LL.booking_motor_label()}
									</p>
									<p class="text-[#1d1d1f] font-bold text-base">{$LL.booking_motor_selected()}</p>
								</div>
							{/if}

							<!-- Details -->
							<div class="p-5 space-y-2.5 text-xs sm:text-sm">
								<div class="flex justify-between items-center">
									<span class="text-[#6b6b70]">{$LL.booking_name_field()}</span>
									<span class="text-[#1d1d1f] font-medium">{formData.namaPenyewa}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-[#6b6b70]">{$LL.booking_whatsapp_field()}</span>
									<span class="text-[#1d1d1f] font-medium">{formData.noWhatsapp}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-[#6b6b70]">{$LL.booking_date_field()}</span>
									<span class="text-[#1d1d1f] font-medium">{formatDate(formData.tanggalMulai)}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-[#6b6b70]">{$LL.booking_time_field()}</span>
									<span class="text-[#1d1d1f] font-medium"
										>{formData.jamMulai} - {formData.jamSelesai}</span
									>
								</div>
								{#if formData.jasHujan > 0 || formData.helm > 0}
									<div class="border-t border-black/5 pt-2.5 mt-2.5">
										{#if formData.jasHujan > 0}
											<div class="flex justify-between items-center mt-1">
												<span class="text-[#6b6b70]">{$LL.booking_raincoat_field()}</span>
												<span class="text-[#0071e3] font-medium"
													>{formData.jasHujan} {$LL.booking_confirm_pieces()}</span
												>
											</div>
										{/if}
										{#if formData.helm > 0}
											<div class="flex justify-between items-center mt-1">
												<span class="text-[#6b6b70]">{$LL.booking_helmet_field()}</span>
												<span class="text-[#0071e3] font-medium"
													>{formData.helm} {$LL.booking_confirm_pieces()}</span
												>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>

						<!-- Price -->
						{#if priceBreakdown}
							<div class="space-y-4">
								<!-- Price Breakdown -->
								<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-5 space-y-2.5">
									<h4
										class="text-[10px] font-semibold text-[#6b6b70] uppercase tracking-wider mb-2"
									>
										{$LL.booking_price_breakdown()}
									</h4>
									<div class="space-y-2 text-xs sm:text-sm">
										<div class="flex justify-between items-center">
											<span class="text-[#6b6b70]">
												{$LL.booking_rental_cost()} ({priceBreakdown.rincian.jumlahHari}
												{$LL.booking_day()} × {formatCurrency(priceBreakdown.rincian.hargaPerHari)})
											</span>
											<span class="text-[#1d1d1f] font-medium">
												{formatCurrency(
													priceBreakdown.rincian.jumlahHari * priceBreakdown.rincian.hargaPerHari
												)}
											</span>
										</div>
										{#if priceBreakdown.rincian.jamTambahan > 0}
											<div class="flex justify-between items-center">
												<span class="text-[#6b6b70]">
													{$LL.booking_additional_fee()} ({priceBreakdown.rincian.jamTambahan} jam × {formatCurrency(
														priceBreakdown.rincian.dendaPerJam
													)})
												</span>
												<span class="text-[#1d1d1f] font-medium">
													{formatCurrency(
														priceBreakdown.rincian.jamTambahan * priceBreakdown.rincian.dendaPerJam
													)}
												</span>
											</div>
										{/if}
										<div
											class="text-[11px] text-[#6b6b70] pt-2 border-t border-black/5"
										>
											{$LL.booking_total_duration()}: {priceBreakdown.rincian.totalJam} jam
										</div>
									</div>
								</div>

								<!-- Total -->
								<div class="bg-[#f5f5f7] border border-black/5 rounded-3xl p-6">
									<div class="flex justify-between items-center">
										<div>
											<p
												class="text-[#6b6b70] text-xs font-semibold tracking-wider uppercase mb-0.5"
											>
												{$LL.booking_total_cost()}
											</p>
										</div>
										<p class="text-2xl sm:text-3xl font-bold text-[#1d1d1f]">
											{formatCurrency(priceBreakdown.totalBiaya)}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<div
								class="bg-white border border-black/5 rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
							>
								<p class="text-[#6b6b70] text-xs">{$LL.booking_calculating()}</p>
							</div>
						{/if}

						<!-- Note -->
						<div class="bg-[#f5f5f7] rounded-2xl p-4 sm:p-5 flex gap-3.5 border border-black/5">
							<svg
								class="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div class="text-xs sm:text-sm">
								<p class="text-[#1d1d1f] font-semibold">{$LL.booking_note_title()}</p>
								<p class="text-[#6b6b70] mt-0.5 leading-relaxed">
									{$LL.booking_note_desc()}
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Navigation Buttons -->
				<div class="flex gap-3 sm:gap-4 mt-8 pt-6 border-t border-black/6">
					{#if currentStep > 0}
						<Button variant="outline" size="md" onclick={prevStep} className="flex-1">
							<svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							{$LL.booking_back()}
						</Button>
					{/if}

					{#if currentStep < steps.length - 1}
						<Button variant="primary" size="md" onclick={nextStep} className="flex-1">
							{$LL.booking_next()}
							<svg class="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</Button>
					{:else}
						<Button
							variant="primary"
							size="md"
							onclick={handleSubmit}
							loading={isSubmitting || isCalculating}
							disabled={isSubmitting || isCalculating}
							className="flex-1"
						>
							{isSubmitting ? $LL.booking_processing() : $LL.booking_confirm()}
						</Button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fadeIn {
		animation: fadeIn 0.25s ease-out;
	}
</style>

