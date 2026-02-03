<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { derived } from 'svelte/store';

	const stats = [
		{ label: 'Happy Riders', value: 1500, suffix: '+' },
		{ label: 'Bikes Available', value: 50, suffix: '' },
		{ label: 'Years Experience', value: 5, suffix: '+' }
	];

	let visible = false;
	let sectionRef: HTMLElement;

	// Create springs
	const springs = stats.map(() => spring(0, { stiffness: 0.05, damping: 0.9 }));

	// Create a derived store that combines all springs into a single array
	const displayedValues = derived(springs, ($springs) => $springs);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !visible) {
					visible = true;
					stats.forEach((stat, i) => {
						springs[i].set(stat.value);
					});
				}
			},
			{ threshold: 0.5 }
		);

		if (sectionRef) observer.observe(sectionRef);
	});
</script>

<section class="py-24 relative bg-brand-dark overflow-hidden" bind:this={sectionRef}>
	<!-- Background Elements -->
	<div
		class="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[128px] pointer-events-none"
	></div>
	<div
		class="absolute bottom-1/2 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[128px] pointer-events-none"
	></div>

	<div class="container mx-auto px-4 relative z-10">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
			{#each $displayedValues as value, i}
				<div
					class="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10"
				>
					<div
						class="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-4 tracking-tighter"
					>
						{Math.round(value)}{stats[i].suffix}
					</div>
					<div class="text-sm md:text-base text-gray-400 uppercase tracking-[0.2em] font-medium">
						{stats[i].label}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
