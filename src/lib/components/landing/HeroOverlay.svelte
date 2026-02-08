<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let scrollY = 0;

	// Configurable text blocks
	const texts = [
		{
			progressStart: 0,
			progressEnd: 0.15,
			text: 'Rosantibike Motorent',
			sub: 'Sewa Motor Premium di Malang',
			align: 'center',
			id: 'hero'
		},
		{
			progressStart: 0.2, // Shifted
			progressEnd: 0.35,
			text: 'Jelajahi Malang',
			sub: 'Dengan kebebasan tanpa batas',
			align: 'left',
			id: 't2'
		},
		{
			progressStart: 0.4, // Shifted
			progressEnd: 0.55,
			text: 'Unit Terawat',
			sub: 'Pelayanan istimewa 24/7',
			align: 'right',
			id: 't3'
		},
		{
			progressStart: 0.6, // Shifted to be safe
			progressEnd: 0.75, // End before overlap covers center
			text: 'Mulai Petualangan',
			sub: 'Sewa motor impianmu sekarang',
			align: 'center',
			id: 'cta'
		}
	];

	let activeIndex = -1;

	// Helper to calculate scroll progress (0 to 1) relative to total scroll height of the sequence
	// Note: The parent container is usually passed or we assume global scroll for simplicity here
	// For a cleaner approach, allow passing `scrollProgress` prop from parent
	export let scrollProgress = 0;

	$: {
		activeIndex = texts.findIndex(
			(t) => scrollProgress >= t.progressStart && scrollProgress <= t.progressEnd
		);
	}
</script>

<div
	class="fixed inset-0 pointer-events-none z-20 flex flex-col justify-center px-4 md:px-20 overflow-hidden"
>
	<!-- Decorative Corner UI (hidden on mobile) -->
	<div
		class="absolute top-20 sm:top-24 left-4 sm:left-10 md:left-20 opacity-30 sm:opacity-40 hidden sm:block"
	>
		<div
			class="flex items-center gap-2 sm:gap-4 text-[8px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/50 uppercase"
		>
			<span class="w-6 sm:w-12 h-[1px] bg-white/30"></span>
			Malang Adventure
		</div>
	</div>

	<div
		class="absolute bottom-20 sm:bottom-24 right-4 sm:right-10 md:right-20 opacity-30 sm:opacity-40 hidden md:block"
	>
		<div
			class="flex flex-col items-end gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.3em] text-white/50 uppercase"
		>
			<div>Lat: -7.9839 | Lon: 112.6214</div>
			<div class="flex items-center gap-2">
				Status: <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Optimal
			</div>
		</div>
	</div>

	<!-- Vertical Progress Hub -->
	<div class="absolute right-10 top-1/2 -translate-y-1/2 h-64 w-[2px] bg-white/10 hidden md:block">
		<div
			class="absolute top-0 left-0 w-full bg-white transition-all duration-300"
			style="height: {scrollProgress * 100}%"
		></div>
		{#each texts as t, i}
			<div
				class="absolute h-1 w-4 -left-1 bg-white/20 transition-all duration-500"
				class:bg-white={i === activeIndex}
				class:w-6={i === activeIndex}
				style="top: {t.progressStart * 100}%"
			>
				<span class="absolute left-8 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40"
					>0{i + 1}</span
				>
			</div>
		{/each}
	</div>

	<!-- Main Text Content -->
	{#each texts as t, i}
		{#if i === activeIndex}
			<div
				class="absolute w-full px-4 sm:px-8 md:px-16 lg:px-20 flex flex-col items-start"
				class:items-center={t.align === 'center'}
				class:items-start={t.align === 'left'}
				class:items-end={t.align === 'right'}
				class:text-center={t.align === 'center'}
				class:text-left={t.align === 'left'}
				class:text-right={t.align === 'right'}
				class:left-0={true}
			>
				<div class="relative inline-block overflow-hidden py-2 sm:py-4">
					<h2
						in:fly={{ y: 50, duration: 800, easing: (t) => t * (2 - t) }}
						out:fly={{ y: -50, duration: 600 }}
						class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tighter mb-2 sm:mb-4 drop-shadow-2xl leading-[0.9] uppercase"
					>
						{#if t.id === 'hero'}
							<span class="block relative">
								<span
									class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40"
									>Rosantibike</span
								>
							</span>
							<span
								class="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/60 mt-1 sm:mt-2 font-light tracking-[0.2em]"
								>Motorent</span
							>
						{:else}
							<span>{t.text}</span>
						{/if}
					</h2>
				</div>

				<p
					in:fly={{ y: 20, duration: 800, delay: 150 }}
					out:fly={{ y: -20, duration: 600 }}
					class="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-mono tracking-wider sm:tracking-widest max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl uppercase mt-2 sm:mt-4"
				>
					<span class="inline-block w-3 sm:w-4 h-[1px] bg-white mr-2 sm:mr-4 align-middle"></span>
					{t.sub}
				</p>

				{#if t.id === 'cta'}
					<div
						in:fade={{ delay: 300 }}
						class="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center gap-3 sm:gap-4"
					>
						<button
							class="group relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-white text-black font-bold text-sm sm:text-base md:text-lg uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all hover:scale-105 pointer-events-auto rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] sm:shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden"
						>
							<span class="relative z-10">Pesan via WhatsApp</span>
							<div
								class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
							></div>
							<span
								class="absolute inset-0 flex items-center justify-center z-10 group-hover:text-white transition-colors duration-500 opacity-0 group-hover:opacity-100"
								>Pesan via WhatsApp</span
							>
						</button>
						<span
							class="text-[8px] sm:text-[10px] font-mono text-white/30 tracking-[0.2em] sm:tracking-[0.4em]"
							>Mitra Rental Resmi Malang</span
						>
					</div>
				{/if}
			</div>
		{/if}
	{/each}

	<!-- Scroll Indicator hint -->
	{#if scrollProgress < 0.05}
		<div
			class="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4 text-white animate-bounce"
			in:fade
		>
			<span
				class="text-[8px] sm:text-[10px] font-mono tracking-[0.3em] sm:tracking-[0.4em] opacity-40 uppercase"
				>Gulir</span
			>
			<div class="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-white to-transparent"></div>
		</div>
	{/if}
</div>
