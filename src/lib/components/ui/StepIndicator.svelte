<script lang="ts">
	interface Props {
		steps?: { title: string; description?: string }[];
		currentStep?: number;
	}

	let { steps = [], currentStep = 0 }: Props = $props();

	let isCompleted = $derived((index: number) => index < currentStep);
	let isCurrent = $derived((index: number) => index === currentStep);
	let progressWidth = $derived(
		currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100
	);
</script>

<div class="w-full mb-10">
	<div class="flex items-center justify-between relative px-2 sm:px-6">
		<!-- Progress Line Background -->
		<div class="absolute top-4 sm:top-5 left-8 sm:left-14 right-8 sm:right-14 h-0.5 bg-black/8 -z-10"></div>

		<!-- Progress Line Active -->
		<div
			class="absolute top-4 sm:top-5 left-8 sm:left-14 h-0.5 bg-apple-blue transition-all duration-500 -z-10"
			style="width: calc({progressWidth}% * (100% - 4rem) / 100)"
		></div>

		<!-- Steps -->
		{#each steps as step, index}
			<div class="flex flex-col items-center z-10">
				<div
					class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 {isCompleted(
						index
					)
						? 'bg-apple-blue text-white shadow-sm'
						: isCurrent(index)
							? 'bg-[#1d1d1f] text-white ring-4 ring-black/5 shadow-sm'
							: 'bg-[#f5f5f7] text-[#6b6b70] border border-black/5'}"
				>
					{#if isCompleted(index)}
						<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						{index + 1}
					{/if}
				</div>
				<span
					class="mt-2.5 text-[11px] sm:text-xs font-medium text-center max-w-18 sm:max-w-22 leading-tight {isCurrent(
						index
					)
						? 'text-[#1d1d1f] font-semibold'
						: isCompleted(index)
							? 'text-apple-blue'
							: 'text-[#6b6b70]'}"
				>
					{step.title}
				</span>
			</div>
		{/each}
	</div>
</div>

