<script lang="ts">
	import { LL } from '$i18n/i18n-svelte';
	import { lazyVideo } from '$lib/actions/lazyVideo';

	let videoRef = $state<HTMLVideoElement>();
	let isPlaying = $state(false);

	function togglePlay() {
		if (!videoRef) return;
		if (isPlaying) {
			videoRef.pause();
			isPlaying = false;
		} else {
			videoRef.play();
			isPlaying = true;
		}
	}
</script>

<div class="bg-brand-background py-16 lg:py-24" id="promotional-video">
	<div class="w-full max-w-7xl mx-auto px-6 md:px-10">
		<div class="text-center mb-12">
			<h2 class="text-sm font-bold text-blue-500 tracking-[0.2em] mb-4 uppercase flex items-center justify-center gap-2">
				<span class="w-8 h-px bg-blue-500"></span>
				Experience The Ride
				<span class="w-8 h-px bg-blue-500"></span>
			</h2>
			<h3 class="text-3xl md:text-5xl font-black text-brand-fg mt-2 mb-6 uppercase tracking-tighter">
				{$LL.why_heading()} <br/>
				<span class="text-transparent bg-clip-text bg-linear-to-r from-brand-fg via-brand-fg/80 to-brand-fg/40">
					{$LL.why_heading_highlight()}
				</span>
			</h3>
			<p class="text-brand-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
				{$LL.why_desc()}
			</p>
		</div>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden border border-brand-border bg-black shadow-2xl group cursor-pointer" 
			onclick={togglePlay}
		>
			<video
				preload="metadata" 
				src="/video/whychooseus.mp4" 
				use:lazyVideo
				poster="/video/posters/whychooseus.jpg"
				class="w-full h-full object-cover"
				bind:this={videoRef}
				playsinline
				onplay={() => isPlaying = true}
				onpause={() => isPlaying = false}
				onended={() => isPlaying = false}
			></video>
			
			{#if !isPlaying}
				<div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300">
					<div class="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/30 transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-500">
						<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="ml-2">
							<polygon points="5 3 19 12 5 21 5 3"></polygon>
						</svg>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>