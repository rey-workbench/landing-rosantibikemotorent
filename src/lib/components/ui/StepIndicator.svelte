<script lang="ts">
	interface Props {
		steps?: { title: string; description?: string }[];
		currentStep?: number;
	}

	let { steps = [], currentStep = 0 }: Props = $props();

	let isCompleted = $derived((index: number) => index < currentStep);
	let isCurrent = $derived((index: number) => index === currentStep);
	let progressWidth = $derived(currentStep === 0 ? 0 : (currentStep / (steps.length - 1)) * 100);
</script>

<div class="w-full mb-8">
	<div class="flex items-center justify-between relative px-2">
		<!-- Progress Line Background -->
		<div class="absolute top-5 left-10 right-10 h-0.5 bg-brand-border -z-10"></div>

		<!-- Progress Line Active -->
		<div
			class="absolute top-5 left-10 h-0.5 bg-brand-fg transition-all duration-500 -z-10"
			style="width: calc({progressWidth}% * (100% - 5rem) / 100)"
		></div>

		<!-- Steps -->
		{#each steps as step, index}
			<div class="flex flex-col items-center z-10">
				<div
					class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ease-(--ease-luxury) {isCompleted(
						index
					)
						? 'bg-brand-fg text-brand-surface'
						: isCurrent(index)
							? 'bg-brand-fg text-brand-surface'
							: 'bg-brand-surface-soft text-brand-muted border border-brand-border'}"
				>
					{#if isCompleted(index)}
						<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					{:else}
						{index + 1}
					{/if}
				</div>
				<span
					class="mt-3 text-xs font-medium text-center max-w-20 {isCurrent(index)
						? 'text-brand-fg font-bold'
						: 'text-brand-muted'}"
				>
					{step.title}
				</span>
			</div>
		{/each}
	</div>
</div>
