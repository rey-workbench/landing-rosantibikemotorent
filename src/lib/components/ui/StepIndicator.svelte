<script lang="ts">
	export let steps: { title: string; description?: string }[] = [];
	export let currentStep = 0;

	$: isCompleted = (index: number) => index < currentStep;
	$: isCurrent = (index: number) => index === currentStep;
	$: progressWidth = currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100;
</script>

<div class="w-full mb-8">
	<div class="flex items-center justify-between relative px-2">
		<!-- Progress Line Background -->
		<div class="absolute top-5 left-[2.5rem] right-[2.5rem] h-[2px] bg-white/20 -z-10"></div>
		
		<!-- Progress Line Active -->
		<div 
			class="absolute top-5 left-[2.5rem] h-[2px] bg-white transition-all duration-500 -z-10"
			style="width: calc({progressWidth}% * (100% - 5rem) / 100)"
		></div>

		<!-- Steps -->
		{#each steps as step, index}
			<div class="flex flex-col items-center z-10">
				<div
					class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 {isCompleted(index)
						? 'bg-white text-black'
						: isCurrent(index)
							? 'bg-white text-black ring-4 ring-white/30'
							: 'bg-white/20 text-white/60'}"
				>
					{#if isCompleted(index)}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						{index + 1}
					{/if}
				</div>
				<span
					class="mt-3 text-xs font-medium text-center max-w-[80px] {isCurrent(index)
						? 'text-white'
						: 'text-gray-400'}"
				>
					{step.title}
				</span>
			</div>
		{/each}
	</div>
</div>
