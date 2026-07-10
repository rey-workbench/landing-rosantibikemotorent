<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { LL } from '$i18n/i18n-svelte';
	import { siteConfig } from '$lib/config';

	let { scrollProgress = 0, isMobile = false } = $props();

	const whatsappHref = $derived(
		`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Halo, saya tertarik untuk menyewa motor.')}`
	);

	const texts = $derived([
		{
			progressStart: 0,
			progressEnd: 0.2,
			text: $LL.hero_title(),
			sub: $LL.hero_tagline(),
			align: 'center',
			id: 'hero'
		},
		{
			progressStart: 0.25,
			progressEnd: 0.45,
			text: $LL.hero_explore(),
			sub: $LL.hero_explore_sub(),
			align: 'left',
			id: 't2'
		},
		{
			progressStart: 0.5,
			progressEnd: 0.7,
			text: $LL.hero_unit_well(),
			sub: $LL.hero_unit_well_sub(),
			align: 'right',
			id: 't3'
		},
		{
			progressStart: 0.75,
			progressEnd: 0.92,
			text: $LL.hero_start(),
			sub: $LL.hero_start_sub(),
			align: 'center',
			id: 'cta'
		}
	]);

	let activeIndex = $derived(
		texts.findIndex((t) => scrollProgress >= t.progressStart && scrollProgress <= t.progressEnd)
	);
</script>

<div
	class="{isMobile
		? 'absolute'
		: 'fixed'} inset-0 pointer-events-none z-20 flex flex-col justify-center px-4 md:px-20 overflow-hidden"
>
	{#each texts as t, i}
		{#if i === activeIndex}
			<div
				class="absolute w-full px-4 sm:px-8 md:px-16 lg:px-20 flex flex-col"
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
						class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tighter mb-2 sm:mb-4 leading-[0.9] uppercase"
					>
						{#if t.id === 'hero'}
							<span class="block relative">
								<span
									class="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/40"
									>{$LL.hero_title()}</span
								>
							</span>
							<span
								class="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/70 mt-1 sm:mt-2 font-light tracking-[0.2em]"
								>{$LL.hero_subtitle()}</span
							>
						{:else}
							<span>{t.text}</span>
						{/if}
					</h2>
				</div>

				<p
					in:fly={{ y: 20, duration: 800, delay: 150 }}
					out:fly={{ y: -20, duration: 600 }}
					class="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 font-mono tracking-wider sm:tracking-widest max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl uppercase mt-2 sm:mt-4"
				>
					<span class="inline-block w-3 sm:w-4 h-px bg-white mr-2 sm:mr-4 align-middle"></span>
					{t.sub}
				</p>

				{#if t.id === 'cta'}
					<div
						in:fade={{ delay: 300 }}
						class="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center gap-3 sm:gap-4"
					>
						<a
							href={whatsappHref}
							target="_blank"
							rel="noopener noreferrer"
							class="group relative px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-white text-black font-bold text-sm sm:text-base md:text-lg uppercase tracking-widest sm:tracking-[0.2em] transition-all hover:scale-105 pointer-events-auto rounded-full overflow-hidden inline-block"
						>
							<span
								class="relative z-10 text-black group-hover:text-white transition-colors duration-500"
								>{$LL.hero_book_whatsapp()}</span
							>
							<div
								class="absolute inset-0 bg-linear-to-r from-green-400 to-green-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
							></div>
						</a>
						<span
							class="text-[8px] sm:text-[10px] font-mono text-white/50 tracking-[0.2em] sm:tracking-[0.4em]"
							>{$LL.hero_partner()}</span
						>
					</div>
				{/if}
			</div>
		{/if}
	{/each}

	{#if scrollProgress < 0.12 && !isMobile}
		<div
			class="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4 text-white animate-bounce"
			in:fade
		>
			<span
				class="text-[8px] sm:text-[10px] font-mono tracking-[0.3em] sm:tracking-[0.4em] opacity-40 uppercase"
				>{$LL.hero_scroll()}</span
			>
			<div class="w-px h-8 sm:h-12 bg-linear-to-b from-white to-transparent"></div>
		</div>
	{/if}

	<!-- H1 FIX: Mobile slide progress dots -->
	{#if isMobile && activeIndex >= 0}
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" in:fade>
			{#each texts as _t, i}
				<div
					class="rounded-full transition-all duration-300 {i === activeIndex
						? 'w-5 h-1.5 bg-white'
						: 'w-1.5 h-1.5 bg-white/30'}"
				></div>
			{/each}
		</div>
	{/if}
</div>
