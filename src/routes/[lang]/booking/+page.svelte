<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { transaksiApi } from '$lib/api';
	import type { UnitMotor, PriceCalculation } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import PhoneInput from '$lib/components/ui/PhoneInput.svelte';
	import StepIndicator from '$lib/components/ui/StepIndicator.svelte';
	import { parsePhoneNumberFromString } from 'libphonenumber-js';
	import LL from '$i18n/i18n-svelte.js';
	import { SeoHead } from '$lib/components/seo';

	export let data;
	$: lang = ($page.params.lang || 'id') as 'id' | 'en';
	$: currentUrl = $page.url.href;

	// State
	let availableMotors: UnitMotor[] = data.availableMotors;
	let uniqueMotors: UnitMotor[] = [];
	let selectedUnit: UnitMotor | null = null;

	$: {
		const seen = new Set();
		uniqueMotors = availableMotors.filter((m) => {
			const key = `${m.jenisId}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}

	$: {
		if (formData.jenisId) {
			selectedUnit = availableMotors.find((m) => m.jenisId === formData.jenisId) || null;
		} else if (formData.unitId) {
			selectedUnit = availableMotors.find((m) => m.id === formData.unitId) || null;
		} else {
			selectedUnit = null;
		}
	}

	// Steps configuration
	$: steps = [
		{ title: $LL.booking_steps_personal_title(), description: $LL.booking_steps_personal_desc() },
		{ title: $LL.booking_steps_motor_title(), description: $LL.booking_steps_motor_desc() },
		{ title: $LL.booking_steps_time_title(), description: $LL.booking_steps_time_desc() },
		{ title: $LL.booking_steps_confirm_title(), description: $LL.booking_steps_confirm_desc() }
	];

	let currentStep = 0;

	// Form State
	let formData = {
		namaPenyewa: '',
		noWhatsapp: '',
		unitId: data.selectedUnitFromUrl?.id || '',
		jenisId: data.selectedUnitFromUrl?.jenisId || '',
		tanggalMulai: data.defaultDates.mulai,
		tanggalSelesai: data.defaultDates.selesai,
		jamMulai: '08:00',
		jamSelesai: '08:00',
		jasHujan: 0,
		helm: 0
	};

	let priceBreakdown: PriceCalculation | null = null;
	let isCalculating = false;
	let isSubmitting = false;
	let formError = '';
	let success = false;

	onMount(async () => {
		if (data.selectedUnitFromUrl) {
			handleCalculatePrice();
		}
	});

	async function handleCalculatePrice() {
		if (!formData.unitId && !formData.jenisId) return;
		if (!formData.tanggalMulai || !formData.tanggalSelesai) return;

		if (isCalculating) return;

		isCalculating = true;
		formError = '';

		try {
			const result = await transaksiApi.calculatePrice({
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
		} catch (err) {
			console.error('Price calculation failed:', err);
			formError = err instanceof Error ? err.message : $LL.booking_error_price_calc();
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
			const parsed = normalized.startsWith('+')
				? parsePhoneNumberFromString(normalized)
				: parsePhoneNumberFromString(normalized);

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
			const response = await transaksiApi.create({
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
		} catch (err) {
			formError = err instanceof Error ? err.message : $LL.booking_error_create();
		} finally {
			isSubmitting = false;
		}
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(price);
	}

	function handleMotorChange() {
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

<section class="pt-32 pb-20 px-4 md:px-10">
	<div class="max-w-3xl mx-auto">
		<!-- Header -->
		<div class="mb-10 text-center">
			<h2
				class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center justify-center gap-2"
			>
				<span class="w-8 h-[1px] bg-blue-500"></span>
				{$LL.booking_header_title()}
				<span class="w-8 h-[1px] bg-blue-500"></span>
			</h2>
			<h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
				{$LL.booking_header_order()}
				<span
					class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600"
					>{$LL.booking_header_motor()}</span
				>
			</h1>
			<p class="text-gray-400 mt-4 max-w-xl mx-auto">
				{$LL.booking_header_subtitle()}
			</p>
		</div>

		{#if success}
			<!-- Success Message -->
			<div class="glass-surface rounded-3xl p-12 text-center">
				<div
					class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
				>
					<svg
						class="w-10 h-10 text-green-400"
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
				</div>
				<h3 class="text-2xl font-bold text-white mb-3">{$LL.booking_success_title()}</h3>
				<p class="text-gray-400">{$LL.booking_success_message()}</p>
			</div>
		{:else}
			<!-- Step Indicator -->
			<StepIndicator {steps} {currentStep} />

			<!-- Form Card -->
			<div class="glass-surface rounded-3xl p-6 md:p-8">
				{#if formError}
					<div
						class="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
					>
						<svg
							class="w-5 h-5 text-red-400 flex-shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p class="text-red-400 text-sm">{formError}</p>
					</div>
				{/if}

				<!-- Step 1: Data Diri -->
				{#if currentStep === 0}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-8">
							<h3 class="text-xl font-bold text-white">{$LL.booking_step1_title()}</h3>
							<p class="text-gray-400 text-sm mt-1">{$LL.booking_step1_desc()}</p>
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

				<!-- Step 2: Pilih Motor -->
				{#if currentStep === 1}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-8">
							<h3 class="text-xl font-bold text-white">Pilih Motor</h3>
							<p class="text-gray-400 text-sm mt-1">Pilih motor yang ingin disewa</p>
						</div>

						<Input
							id="unit-motor"
							type="dropdown"
							label={$LL.booking_motor_type_label()}
							bind:value={formData.jenisId}
							required
							options={uniqueMotors.map((m) => {
								const jenis = m.jenis || m.jenisMotor;
								return {
									value: m.jenisId,
									label: `${jenis?.merk} ${jenis?.model} - ${formatPrice(jenis?.hargaSewa || 0)}/${$LL.booking_day()}`
								};
							})}
							placeholder={$LL.booking_motor_placeholder()}
							on:change={handleMotorChange}
						/>

						{#if selectedUnit}
							{@const jenis = selectedUnit.jenis || selectedUnit.jenisMotor}
							<div
								class="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 mt-4"
							>
								{#if jenis?.gambar}
									<img
										src={jenis.gambar}
										alt={jenis.model}
										class="w-24 h-24 object-cover rounded-xl"
									/>
								{/if}
								<div class="flex-1">
									<p class="text-gray-400 text-sm">{jenis?.merk}</p>
									<p class="text-white font-bold text-lg">{jenis?.model}</p>
									{#if jenis?.cc}
										<p class="text-gray-500 text-sm">{jenis.cc} CC</p>
									{/if}
									<p class="text-green-400 font-bold mt-1">
										{formatPrice((selectedUnit.jenis || selectedUnit.jenisMotor)?.hargaSewa || 0)}
										<span class="text-gray-500 font-normal text-sm">/ {$LL.booking_day()}</span>
									</p>
								</div>
							</div>
						{:else}
							<div
								class="bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center"
							>
								<svg
									class="w-12 h-12 text-gray-500 mx-auto mb-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
									/>
								</svg>
								<p class="text-gray-400">{$LL.booking_motor_select()}</p>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Step 3: Waktu Sewa -->
				{#if currentStep === 2}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-8">
							<h3 class="text-xl font-bold text-white">{$LL.booking_step3_title()}</h3>
							<p class="text-gray-400 text-sm mt-1">{$LL.booking_step3_desc()}</p>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Input
								id="tanggal-mulai"
								label={$LL.booking_start_date_label()}
								type="date"
								bind:value={formData.tanggalMulai}
								on:change={handleCalculatePrice}
								required
							/>
							<Input
								id="jam-mulai"
								label={$LL.booking_start_time_label()}
								type="time"
								bind:value={formData.jamMulai}
								on:change={handleCalculatePrice}
								required
							/>
							<Input
								id="tanggal-selesai"
								label={$LL.booking_end_date_label()}
								type="date"
								bind:value={formData.tanggalSelesai}
								on:change={handleCalculatePrice}
								required
							/>
							<Input
								id="jam-selesai"
								label={$LL.booking_end_time_label()}
								type="time"
								bind:value={formData.jamSelesai}
								on:change={handleCalculatePrice}
								required
							/>
						</div>

						<div class="border-t border-white/10 pt-6">
							<h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
								{$LL.booking_accessories_label()}
							</h4>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									id="jas-hujan"
									type="dropdown"
									label={$LL.booking_raincoat_label()}
									bind:value={formData.jasHujan}
									on:change={handleCalculatePrice}
									options={[
										{ value: 0, label: $LL.booking_not_needed() },
										{ value: 1, label: $LL.booking_pieces_1() },
										{ value: 2, label: $LL.booking_pieces_2() }
									]}
									placeholder={$LL.booking_raincoat_placeholder()}
								/>
								<Input
									id="helm"
									type="dropdown"
									label={$LL.booking_helmet_label()}
									bind:value={formData.helm}
									on:change={handleCalculatePrice}
									options={[
										{ value: 0, label: $LL.booking_not_needed() },
										{ value: 1, label: $LL.booking_pieces_1() },
										{ value: 2, label: $LL.booking_pieces_2() }
									]}
									placeholder={$LL.booking_helmet_placeholder()}
								/>
							</div>
							<p class="text-xs text-gray-500 mt-3 flex items-center gap-2">
								<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{$LL.booking_accessories_free()}
							</p>
						</div>
					</div>
				{/if}

				<!-- Step 4: Konfirmasi -->
				{#if currentStep === 3}
					<div class="space-y-6 animate-fadeIn">
						<div class="text-center mb-6">
							<h3 class="text-xl font-bold text-white">{$LL.booking_step4_title()}</h3>
							<p class="text-gray-400 text-sm mt-1">{$LL.booking_step4_desc()}</p>
						</div>

						<!-- Summary Card -->
						<div class="bg-white/5 rounded-2xl overflow-hidden">
							<!-- Motor Info -->
							{#if selectedUnit}
								{@const jenis = selectedUnit.jenis || selectedUnit.jenisMotor}
								<div class="p-4 flex items-center gap-4 border-b border-white/10">
									{#if jenis?.gambar}
										<img
											src={jenis.gambar}
											alt={jenis.model}
											class="w-16 h-16 object-cover rounded-xl"
										/>
									{/if}
									<div>
										<p class="text-gray-400 text-xs uppercase">{$LL.booking_motor_label()}</p>
										<p class="text-white font-bold">{jenis?.merk} {jenis?.model}</p>
									</div>
								</div>
							{:else if formData.jenisId || formData.unitId}
								<div class="p-4 border-b border-white/10">
									<p class="text-gray-400 text-xs uppercase">{$LL.booking_motor_label()}</p>
									<p class="text-white font-bold">{$LL.booking_motor_selected()}</p>
								</div>
							{/if}

							<!-- Details -->
							<div class="p-4 space-y-3">
								<div class="flex justify-between">
									<span class="text-gray-400">{$LL.booking_name_field()}</span>
									<span class="text-white font-medium">{formData.namaPenyewa}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-400">{$LL.booking_whatsapp_field()}</span>
									<span class="text-white font-medium">{formData.noWhatsapp}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-400">{$LL.booking_date_field()}</span>
									<span class="text-white font-medium">{formatDate(formData.tanggalMulai)}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-400">{$LL.booking_time_field()}</span>
									<span class="text-white font-medium"
										>{formData.jamMulai} - {formData.jamSelesai}</span
									>
								</div>
								{#if formData.jasHujan > 0 || formData.helm > 0}
									<div class="border-t border-white/10 pt-3 mt-3">
										{#if formData.jasHujan > 0}
											<div class="flex justify-between">
												<span class="text-gray-400">{$LL.booking_raincoat_field()}</span>
												<span class="text-green-400"
													>{formData.jasHujan} {$LL.booking_confirm_pieces()}</span
												>
											</div>
										{/if}
										{#if formData.helm > 0}
											<div class="flex justify-between">
												<span class="text-gray-400">{$LL.booking_helmet_field()}</span>
												<span class="text-green-400"
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
							<div class="space-y-3">
								<!-- Price Breakdown -->
								<div class="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
									<h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
										{$LL.booking_price_breakdown()}
									</h4>
									<div class="space-y-2">
										<div class="flex justify-between text-sm">
											<span class="text-gray-400">
												{$LL.booking_rental_cost()} ({priceBreakdown.rincian.jumlahHari}
												{$LL.booking_day()} × {formatPrice(priceBreakdown.rincian.hargaPerHari)})
											</span>
											<span class="text-white font-medium">
												{formatPrice(
													priceBreakdown.rincian.jumlahHari * priceBreakdown.rincian.hargaPerHari
												)}
											</span>
										</div>
										{#if priceBreakdown.rincian.jamTambahan > 0}
											<div class="flex justify-between text-sm">
												<span class="text-gray-400">
													{$LL.booking_additional_fee()} ({priceBreakdown.rincian.jamTambahan} jam × {formatPrice(
														priceBreakdown.rincian.dendaPerJam
													)})
												</span>
												<span class="text-white font-medium">
													{formatPrice(priceBreakdown.rincian.biayaJamTambahan)}
												</span>
											</div>
										{/if}
										<div class="text-xs text-gray-500 pt-2 border-t border-white/10">
											{$LL.booking_total_duration()}: {priceBreakdown.rincian.totalJam} jam
										</div>
									</div>
								</div>

								<!-- Total -->
								<div
									class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-5"
								>
									<div class="flex justify-between items-center">
										<div>
											<p class="text-gray-400 text-sm">{$LL.booking_total_cost()}</p>
										</div>
										<p class="text-2xl font-bold text-white">
											{formatPrice(priceBreakdown.totalBiaya)}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<div class="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
								<p class="text-gray-400">{$LL.booking_calculating()}</p>
							</div>
						{/if}

						<!-- Note -->
						<div class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
							<svg
								class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div class="text-sm">
								<p class="text-blue-300 font-medium">{$LL.booking_note_title()}</p>
								<p class="text-gray-400 mt-1">
									{$LL.booking_note_desc()}
								</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Navigation Buttons -->
				<div class="flex gap-4 mt-8">
					{#if currentStep > 0}
						<Button variant="outline" on:click={prevStep} className="flex-1">
							<svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							{$LL.booking_back()}
						</Button>
					{/if}

					{#if currentStep < steps.length - 1}
						<Button variant="primary" on:click={nextStep} className="flex-1">
							{$LL.booking_next()}
							<svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</Button>
					{:else}
						<Button
							variant="primary"
							on:click={handleSubmit}
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
</section>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out;
	}
</style>
