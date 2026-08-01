<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { LL } from '$i18n/i18n-svelte';

	const stats = $derived([
		{ label: $LL.stats_customers(), value: 1500, suffix: '+' },
		{ label: $LL.stats_units(), value: 50, suffix: '' },
		{ label: $LL.stats_experience(), value: 5, suffix: '+' }
	]);

	let visible = $state(false);
	let sectionRef = $state<HTMLElement>();

	const spring1 = spring(0, { stiffness: 0.1, damping: 0.7 });
	const spring2 = spring(0, { stiffness: 0.1, damping: 0.7 });
	const spring3 = spring(0, { stiffness: 0.1, damping: 0.7 });

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !visible) {
					visible = true;
					const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
					if (prefersReduced) {
						spring1.set(stats[0].value, { hard: true });
						spring2.set(stats[1].value, { hard: true });
						spring3.set(stats[2].value, { hard: true });
					} else {
						spring1.set(stats[0].value);
						spring2.set(stats[1].value);
						spring3.set(stats[2].value);
					}
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		if (sectionRef) observer.observe(sectionRef);

		return () => {
			if (sectionRef) observer.unobserve(sectionRef);
		};
	});
</script>

<section class="py-24 md:py-36 relative bg-[#f5f5f7] overflow-hidden z-20" bind:this={sectionRef}>
	<div class="container mx-auto px-6 md:px-10 relative z-10 max-w-345">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div
				class="p-10 md:p-14 rounded-3xl bg-white border border-black/5 transition-all duration-300 hover:scale-[1.02] text-center flex flex-col justify-center min-h-75"
			>
				<div class="text-6xl md:text-8xl font-bold text-[#1d1d1f] mb-3 tracking-tight leading-none">
					{Math.round($spring1)}{stats[0].suffix}
				</div>
				<div class="text-sm md:text-lg text-[#86868b] font-medium tracking-wide">
					{stats[0].label}
				</div>
			</div>
			<div
				class="p-10 md:p-14 rounded-3xl bg-white border border-black/5 transition-all duration-300 hover:scale-[1.02] text-center flex flex-col justify-center min-h-75"
			>
				<div class="text-6xl md:text-8xl font-bold text-[#1d1d1f] mb-3 tracking-tight leading-none">
					{Math.round($spring2)}{stats[1].suffix}
				</div>
				<div class="text-sm md:text-lg text-[#86868b] font-medium tracking-wide">
					{stats[1].label}
				</div>
			</div>
			<div
				class="p-10 md:p-14 rounded-3xl bg-white border border-black/5 transition-all duration-300 hover:scale-[1.02] text-center flex flex-col justify-center min-h-75"
			>
				<div class="text-6xl md:text-8xl font-bold text-[#1d1d1f] mb-3 tracking-tight leading-none">
					{Math.round($spring3)}{stats[2].suffix}
				</div>
				<div class="text-sm md:text-lg text-[#86868b] font-medium tracking-wide">
					{stats[2].label}
				</div>
			</div>
		</div>
	</div>
</section>
