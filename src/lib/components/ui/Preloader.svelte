<script>
    import { loadingProgress, isLoaded } from "$lib/stores/loading";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
</script>

{#if !$isLoaded}
    <div
        class="fixed inset-0 z-[100] bg-brand-dark flex flex-col justify-center items-center text-white"
        transition:fade={{ duration: 800 }}
    >
        <div
            class="text-9xl font-bold tracking-tighter mb-4 relative overflow-hidden"
        >
            <span
                class="inline-block"
                in:fly={{ y: 100, duration: 1000, easing: cubicOut }}
            >
                {$loadingProgress.toFixed(0)}%
            </span>
        </div>

        <div class="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mt-8">
            <div
                class="h-full bg-white transition-all duration-100 ease-linear"
                style="width: {$loadingProgress}%"
            ></div>
        </div>

        <div
            class="mt-4 text-sm text-gray-500 uppercase tracking-widest animate-pulse"
        >
            Starting Engine...
        </div>
    </div>
{/if}
