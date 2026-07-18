import Hls from 'hls.js';
import type { Action } from 'svelte/action';

export const hls: Action<HTMLVideoElement, string> = (node, initialSrc) => {
	let hlsInstance: Hls | null = null;
	let currentUrl: string = '';
	let observer: IntersectionObserver | null = null;
	let isVisible = false;
	let src = initialSrc;
	let loadTimeout: number | null = null;

	let playPromise: Promise<void> | null = null;

	const playVideo = () => {
		if (hlsInstance) {
			hlsInstance.startLoad();
		}
		if (node.paused && !playPromise) {
			playPromise = node.play();
			playPromise
				.catch((err) => {
					if (err.name !== 'AbortError') {
						console.warn("Autoplay block averted:", err);
					}
				})
				.finally(() => {
					playPromise = null;
				});
		}
	};

	const pauseVideo = () => {
		if (hlsInstance) {
			hlsInstance.stopLoad(); // Stop downloading video segments to free network bandwidth
		}
		
		if (playPromise) {
			playPromise
				.then(() => {
					if (!node.paused) {
						node.pause();
					}
				})
				.catch(() => {});
		} else {
			if (!node.paused) {
				node.pause();
			}
		}
	};

	const init = (url: string) => {
		if (!url) {
			cleanup();
			return;
		}
		
		if (url === currentUrl) {
			if (isVisible) playVideo();
			else pauseVideo();
			return;
		}
		
		currentUrl = url;
		
		if (Hls.isSupported()) {
			if (hlsInstance) {
				hlsInstance.destroy();
			}
			hlsInstance = new Hls({
				capLevelToPlayerSize: true,
				autoStartLoad: isVisible, // Only start downloading if currently visible
				maxBufferSize: 1.5 * 1024 * 1024,
				maxBufferLength: 2,
				lowLatencyMode: true,
				enableWorker: true
			});
			hlsInstance.loadSource(url);
			hlsInstance.attachMedia(node);
			
			hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
				if (isVisible) playVideo();
			});

			hlsInstance.on(Hls.Events.ERROR, (event, data) => {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							hlsInstance?.startLoad();
							break;
						case Hls.ErrorTypes.MEDIA_ERROR:
							hlsInstance?.recoverMediaError();
							break;
						default:
							const retryUrl = currentUrl;
							currentUrl = '';
							init(retryUrl);
							break;
					}
				}
			});
		} else if (node.canPlayType('application/vnd.apple.mpegurl')) {
			node.src = url;
			if (isVisible) playVideo();
		}
	};

	const cleanup = () => {
		if (loadTimeout) {
			clearTimeout(loadTimeout);
			loadTimeout = null;
		}
		if (hlsInstance) {
			hlsInstance.destroy();
			hlsInstance = null;
		}
		currentUrl = '';
		node.removeAttribute('src');
		node.load();
	};

	// Set up IntersectionObserver with debouncing for fast scrolling
	observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			isVisible = entry.isIntersecting;
			
			if (loadTimeout) {
				clearTimeout(loadTimeout);
				loadTimeout = null;
			}

			if (isVisible) {
				// Debounce loading by 150ms. If user scrolls past quickly, we don't load anything!
				loadTimeout = window.setTimeout(() => {
					init(src);
				}, 150);
			} else {
				pauseVideo();
			}
		}
	}, {
		threshold: 0.1
	});

	observer.observe(node);

	return {
		update(newSrc) {
			src = newSrc;
			if (isVisible) {
				init(newSrc);
			}
		},
		destroy() {
			if (observer) {
				observer.disconnect();
			}
			cleanup();
		}
	};
};
