<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	const stats = [
		{ label: 'Pelanggan Puas', value: 1500, suffix: '+' },
		{ label: 'Unit Tersedia', value: 50, suffix: '' },
		{ label: 'Tahun Pengalaman', value: 5, suffix: '+' }
	];

	let visible = false;
	let sectionRef: HTMLElement;

	const spring1 = spring(0, { stiffness: 0.1, damping: 0.7 });
	const spring2 = spring(0, { stiffness: 0.1, damping: 0.7 });
	const spring3 = spring(0, { stiffness: 0.1, damping: 0.7 });
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !visible) {
					visible = true;
					spring1.set(stats[0].value);
					spring2.set(stats[1].value);
					spring3.set(stats[2].value);
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

<section class="py-24 relative bg-brand-dark overflow-hidden z-20" bind:this={sectionRef}>
	<!-- Background Elements -->
	<div
		class="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[128px] pointer-events-none"
	></div>

	<div class="container mx-auto px-4 relative z-10">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div
				class="group p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-2 text-center"
			>
				<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none">
					{Math.round($spring1)}{stats[0].suffix}
				</div>
				<div class="text-xs md:text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">
					{stats[0].label}
				</div>
			</div>
			<div
				class="group p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-2 text-center"
			>
				<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none">
					{Math.round($spring2)}{stats[1].suffix}
				</div>
				<div class="text-xs md:text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">
					{stats[1].label}
				</div>
			</div>
			<div
				class="group p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-2 text-center"
			>
				<div class="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none">
					{Math.round($spring3)}{stats[2].suffix}
				</div>
				<div class="text-xs md:text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">
					{stats[2].label}
				</div>
			</div>
		</div>
	</div>
</section>
