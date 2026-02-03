<script lang="ts">
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { transaksiApi, unitMotorApi } from '$lib/api';
	import type { UnitMotor, PriceCalculation } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	// State
	let availableMotors: UnitMotor[] = [];
	let selectedUnit: UnitMotor | null = null;
	let loading = true;
	let error = '';

	// Form State
	let formData = {
		namaPenyewa: '',
		noWhatsapp: '',
		unitId: '',
		tanggalMulai: '',
		tanggalSelesai: '',
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
		// Set default dates
		const today = new Date();
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		formData.tanggalMulai = today.toISOString().split('T')[0];
		formData.tanggalSelesai = tomorrow.toISOString().split('T')[0];

		// Get unitId from URL if present
		const urlUnitId = $page.url.searchParams.get('unitId');

		try {
			// Fetch available motors for the dropdown
			const motorsResponse = await unitMotorApi.getAll({ status: 'TERSEDIA' });
			availableMotors = motorsResponse.data || [];

			// If unitId in URL, preselect it
			if (urlUnitId) {
				formData.unitId = urlUnitId;

				// Try to find in available list first
				selectedUnit = availableMotors.find((m) => m.id === urlUnitId) || null;

				// Handle specific unit logic in background if not found
				if (!selectedUnit) {
					unitMotorApi
						.getById(urlUnitId)
						.then((unit) => {
							if (unit) {
								selectedUnit = unit;
								if (!availableMotors.find((m) => m.id === unit.id)) {
									availableMotors = [unit, ...availableMotors];
								}
								handleCalculatePrice();
							}
						})
						.catch((e) => {
							console.error('Failed to fetch specific unit:', e);
						});
				} else {
					// Found in available list, calculate price
					handleCalculatePrice();
				}
			}
		} catch (err) {
			console.error('Initial load error:', err);
			error = err instanceof Error ? err.message : 'Gagal memuat data';
		} finally {
			// Ensure loading is set to false regardless of deep results
			loading = false;
		}
	});

	async function handleCalculatePrice() {
		if (!formData.unitId || !formData.tanggalMulai || !formData.tanggalSelesai) {
			return;
		}

		// Prevent concurrent calculations if unnecessary, but ensure state is clean
		if (isCalculating) return;

		isCalculating = true;
		formError = '';

		try {
			const result = await transaksiApi.calculatePrice({
				unitId: formData.unitId,
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
			formError = err instanceof Error ? err.message : 'Gagal menghitung harga';
			priceBreakdown = null;
		} finally {
			isCalculating = false;
		}
	}

	async function handleSubmit() {
		if (!formData.namaPenyewa || !formData.noWhatsapp || !formData.unitId) {
			formError = 'Lengkapi semua data yang diperlukan';
			return;
		}

		isSubmitting = true;
		formError = '';

		try {
			const response = await transaksiApi.create({
				namaPenyewa: formData.namaPenyewa,
				noWhatsapp: formData.noWhatsapp,
				unitId: formData.unitId,
				tanggalMulai: formData.tanggalMulai,
				tanggalSelesai: formData.tanggalSelesai,
				jamMulai: formData.jamMulai,
				jamSelesai: formData.jamSelesai,
				jasHujan: formData.jasHujan,
				helm: formData.helm
			});

			success = true;
			// Redirect to confirmation
			setTimeout(() => {
				goto(`/booking/success?id=${response.id}`);
			}, 2000);
		} catch (err) {
			formError = err instanceof Error ? err.message : 'Gagal membuat booking';
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

	function handleUnitChange() {
		selectedUnit = availableMotors.find((m) => m.id === formData.unitId) || null;
		handleCalculatePrice();
	}
</script>

<svelte:head>
	<title>Booking Motor - Rosantibike Motorent</title>
	<meta
		name="description"
		content="Booking motor rental di Rosantibike Motorent Malang. Proses cepat dan mudah."
	/>
</svelte:head>

<div class="min-h-screen bg-brand-dark text-white">
	<Navbar />

	<section class="pt-32 pb-20 px-4 md:px-10">
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-12 text-center">
				<h2
					class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center justify-center gap-2"
				>
					<span class="w-8 h-[1px] bg-blue-500"></span>
					Booking
					<span class="w-8 h-[1px] bg-blue-500"></span>
				</h2>
				<h1
					class="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter"
				>
					Pesan Motormu
				</h1>
				<p class="text-gray-400 mt-4 max-w-xl mx-auto">
					Isi formulir di bawah untuk memesan motor. Kami akan menghubungi Anda via WhatsApp untuk
					konfirmasi.
				</p>
			</div>

			{#if loading}
				<div class="flex justify-center py-20">
					<div
						class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
					></div>
				</div>
			{:else if error}
				<div class="bg-red-500/20 border border-red-500/30 rounded-3xl p-12 text-center">
					<div class="text-6xl mb-4">⚠️</div>
					<h3 class="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
					<p class="text-gray-300">{error}</p>
				</div>
			{:else if success}
				<!-- Success Message -->
				<div class="bg-green-500/20 border border-green-500/30 rounded-3xl p-12 text-center">
					<div class="text-6xl mb-4">✓</div>
					<h3 class="text-2xl font-bold text-green-400 mb-2">Booking Berhasil!</h3>
					<p class="text-gray-300">Kami akan segera menghubungi Anda via WhatsApp.</p>
				</div>
			{:else}
				<!-- Booking Form -->
				<div class="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
					{#if formError}
						<div class="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
							<p class="text-red-400">{formError}</p>
						</div>
					{/if}

					<form on:submit|preventDefault={handleSubmit} class="space-y-8">
						<!-- Personal Info Section -->
						<div class="space-y-6">
							<h3 class="text-xl font-bold text-white flex items-center gap-3">
								<span
									class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm"
									>1</span
								>
								Data Penyewa
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									id="nama-penyewa"
									label="Nama Lengkap"
									bind:value={formData.namaPenyewa}
									required
									placeholder="Nama sesuai KTP"
									icon="user"
								/>

								<Input
									id="no-whatsapp"
									label="No. WhatsApp"
									type="tel"
									bind:value={formData.noWhatsapp}
									required
									placeholder="08xxxxxxxxxx"
									icon="phone"
								/>
							</div>
						</div>

						<!-- Motor Selection Section -->
						<div class="space-y-6">
							<h3 class="text-xl font-bold text-white flex items-center gap-3">
								<span
									class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm"
									>2</span
								>
								Pilih Motor
							</h3>

							<div>
								<Select
									id="unit-motor"
									label="Motor"
									bind:value={formData.unitId}
									required
									options={availableMotors.map((m) => {
										const jenis = m.jenis || m.jenisMotor;
										return {
											value: m.id,
											label: `${jenis?.merk} ${jenis?.model} - ${formatPrice(m.hargaSewa)}/hari`
										};
									})}
									placeholder="Pilih Motor"
									on:change={handleUnitChange}
								/>
							</div>

							{#if selectedUnit}
								{@const jenis = selectedUnit.jenis || selectedUnit.jenisMotor}
								<div
									class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-4"
								>
									{#if jenis?.gambar}
										<img
											src={jenis.gambar}
											alt={jenis.model}
											class="w-20 h-20 object-cover rounded-lg"
										/>
									{/if}
									<div>
										<p class="text-blue-400 text-sm">{jenis?.merk}</p>
										<p class="text-white font-bold">{jenis?.model}</p>
										<p class="text-gray-400 text-sm">
											{formatPrice(selectedUnit.hargaSewa)} / hari
										</p>
									</div>
								</div>
							{/if}
						</div>

						<!-- Date & Time Section -->
						<div class="space-y-6">
							<h3 class="text-xl font-bold text-white flex items-center gap-3">
								<span
									class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm"
									>3</span
								>
								Waktu Sewa
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									id="tanggal-mulai"
									label="Tanggal Mulai"
									type="date"
									bind:value={formData.tanggalMulai}
									required
									icon="calendar"
									on:input={() => setTimeout(handleCalculatePrice, 100)}
								/>

								<Input
									id="jam-mulai"
									label="Jam Mulai"
									type="time"
									bind:value={formData.jamMulai}
									required
									on:input={() => setTimeout(handleCalculatePrice, 100)}
								/>

								<Input
									id="tanggal-selesai"
									label="Tanggal Selesai"
									type="date"
									bind:value={formData.tanggalSelesai}
									required
									icon="calendar"
									on:input={() => setTimeout(handleCalculatePrice, 100)}
								/>

								<Input
									id="jam-selesai"
									label="Jam Selesai"
									type="time"
									bind:value={formData.jamSelesai}
									required
									on:input={() => setTimeout(handleCalculatePrice, 100)}
								/>
							</div>
						</div>

						<!-- Accessories Section -->
						<div class="space-y-6">
							<h3 class="text-xl font-bold text-white flex items-center gap-3">
								<span
									class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm"
									>4</span
								>
								Aksesori Tambahan
							</h3>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Select
									id="jas-hujan"
									label="Jas Hujan (maks 2)"
									bind:value={formData.jasHujan}
									options={[
										{ value: 0, label: 'Tidak perlu' },
										{ value: 1, label: '1 buah' },
										{ value: 2, label: '2 buah' }
									]}
									placeholder="Pilih Jas Hujan"
									on:change={handleCalculatePrice}
								/>

								<Select
									id="helm"
									label="Helm Tambahan (maks 2)"
									bind:value={formData.helm}
									options={[
										{ value: 0, label: 'Tidak perlu' },
										{ value: 1, label: '1 buah' },
										{ value: 2, label: '2 buah' }
									]}
									placeholder="Pilih Helm Tambahan"
									on:change={handleCalculatePrice}
								/>
							</div>
						</div>

						<!-- Price Summary -->
						{#if priceBreakdown}
							<div
								class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6"
							>
								<h3 class="text-lg font-bold text-white mb-4">Rincian Biaya</h3>
								<div class="space-y-2 text-gray-300">
									<div class="flex justify-between">
										<span>Sewa ({priceBreakdown.rincian.jumlahHari} hari)</span>
										<span>{formatPrice(priceBreakdown.rincian.hargaSewa)}</span>
									</div>
									{#if formData.jasHujan > 0}
										<div class="flex justify-between">
											<span>Jas Hujan ({formData.jasHujan})</span>
											<span class="text-green-400 font-bold">Gratis</span>
										</div>
									{/if}
									{#if formData.helm > 0}
										<div class="flex justify-between">
											<span>Helm Tambahan ({formData.helm})</span>
											<span class="text-green-400 font-bold">Gratis</span>
										</div>
									{/if}
									<div class="border-t border-white/10 pt-2 mt-2">
										<div class="flex justify-between text-xl font-bold text-white">
											<span>Total</span>
											<span>{formatPrice(priceBreakdown.totalBiaya)}</span>
										</div>
									</div>
								</div>
							</div>
						{/if}

						<!-- Submit Button -->
						<Button
							type="submit"
							fullWidth
							size="lg"
							loading={isSubmitting || isCalculating}
							disabled={isSubmitting || isCalculating}
						>
							{isSubmitting ? 'Memproses...' : 'Konfirmasi Booking'}
						</Button>
					</form>
				</div>
			{/if}
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-12 bg-black text-center text-gray-600 border-t border-gray-900">
		<p>&copy; 2024 Rosantibike Motorent. All Rights Reserved.</p>
	</footer>
</div>
