import Hls from 'hls.js';
import type { Action } from 'svelte/action';

export const hls: Action<HTMLVideoElement, string> = (node, src) => {
	let hlsInstance: Hls | null = null;
	let currentUrl: string = '';

	const init = (url: string) => {
		if (!url) {
			if (hlsInstance) {
				hlsInstance.destroy();
				hlsInstance = null;
			}
			currentUrl = '';
			node.removeAttribute('src');
			node.load();
			return;
		}
		
		if (url === currentUrl) return;
		currentUrl = url;
		
		if (Hls.isSupported()) {
			if (hlsInstance) {
				hlsInstance.destroy();
			}
			hlsInstance = new Hls({
				capLevelToPlayerSize: true,
				autoStartLoad: true,
				maxBufferSize: 1.5 * 1024 * 1024, // 1.5MB max buffer (default: 60MB)
				maxBufferLength: 2,               // 2 seconds buffer (default: 30s)
				lowLatencyMode: true,             // Optimize for low latency / quick start
				enableWorker: true                // Use web worker to offload processing
			});
			hlsInstance.loadSource(url);
			hlsInstance.attachMedia(node);
			
			hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
				node.play().catch((err) => {
					console.warn("HLS autoplay blocked:", err);
				});
			});

			// Recover from fatal errors automatically
			hlsInstance.on(Hls.Events.ERROR, (event, data) => {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							console.warn("HLS network error, attempting recovery...");
							hlsInstance?.startLoad();
							break;
						case Hls.ErrorTypes.MEDIA_ERROR:
							console.warn("HLS media error, attempting recovery...");
							hlsInstance?.recoverMediaError();
							break;
						default:
							console.error("Fatal HLS error, rebuilding player...");
							const retryUrl = currentUrl;
							currentUrl = '';
							init(retryUrl);
							break;
					}
				}
			});
		} else if (node.canPlayType('application/vnd.apple.mpegurl')) {
			node.src = url;
			node.play().catch((err) => {
				console.warn("Native HLS autoplay blocked:", err);
			});
		}
	};

	init(src);

	return {
		update(newSrc) {
			init(newSrc);
		},
		destroy() {
			if (hlsInstance) {
				hlsInstance.destroy();
			}
		}
	};
};
