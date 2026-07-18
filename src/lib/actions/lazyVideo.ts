import type { Action } from 'svelte/action';

export const lazyVideo: Action<HTMLVideoElement, string | undefined> = (node, initialSrc) => {
	let observer: IntersectionObserver | null = null;
	let playPromise: Promise<void> | null = null;

	if (initialSrc && !node.src) {
		node.src = initialSrc;
	}

	const playVideo = () => {
		if (node.paused && !playPromise) {
			playPromise = node.play();
			playPromise
				.catch((err) => {
					if (err.name !== 'AbortError') {
						console.warn('Autoplay block averted:', err);
					}
				})
				.finally(() => {
					playPromise = null;
				});
		}
	};

	const pauseVideo = () => {
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

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					playVideo();
				} else {
					pauseVideo();
				}
			}
		},
		{
			// Start playing just slightly before it fully enters viewport for seamless effect
			rootMargin: '100px',
			threshold: 0
		}
	);

	observer.observe(node);

	return {
		update(newSrc) {
			if (newSrc && newSrc !== node.getAttribute('src') && newSrc !== node.src) {
				node.src = newSrc;
			}
		},
		destroy() {
			if (observer) {
				observer.disconnect();
			}
			node.removeAttribute('src');
			node.load();
		}
	};
};
