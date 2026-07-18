import Hls from 'hls.js';
import type { Action } from 'svelte/action';

export const hls: Action<HTMLVideoElement, string> = (node, src) => {
	let hlsInstance: Hls | null = null;
	let currentUrl: string = '';

	const init = (url: string) => {
		if (!url || url === currentUrl) return;
		currentUrl = url;
		
		if (Hls.isSupported()) {
			if (hlsInstance) {
				hlsInstance.destroy();
			}
			hlsInstance = new Hls({
				capLevelToPlayerSize: true,
				autoStartLoad: true
			});
			hlsInstance.loadSource(url);
			hlsInstance.attachMedia(node);
			
			hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
				node.play().catch((err) => {
					console.warn("HLS autoplay blocked:", err);
				});
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
