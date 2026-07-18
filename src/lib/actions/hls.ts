import Hls from 'hls.js';
import type { Action } from 'svelte/action';

export const hls: Action<HTMLVideoElement, string> = (node, src) => {
	let hlsInstance: Hls | null = null;

	const init = (url: string) => {
		if (!url) return;
		
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
		} else if (node.canPlayType('application/vnd.apple.mpegurl')) {
			node.src = url;
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
