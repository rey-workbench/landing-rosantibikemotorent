<script lang="ts">
	import { onMount } from 'svelte';

	let {
		sitekey,
		onToken,
		theme = 'auto'
	} = $props<{
		sitekey: string;
		onToken: (token: string) => void;
		theme?: 'light' | 'dark' | 'auto';
	}>();

	let widgetContainer: HTMLElement;
	let widgetId: string | undefined;

	onMount(() => {
		const initTurnstile = () => {
			// @ts-ignore
			if (window.turnstile && widgetContainer) {
				// @ts-ignore
				widgetId = window.turnstile.render(widgetContainer, {
					sitekey,
					theme,
					callback: (token: string) => {
						onToken(token);
					},
					'error-callback': () => {
						console.error('Turnstile verification failed');
						onToken(''); // Clear token on error
					},
					'expired-callback': () => {
						console.warn('Turnstile token expired');
						onToken(''); // Clear token on expiry
					}
				});
			}
		};

		// @ts-ignore
		if (!window.turnstile) {
			const script = document.createElement('script');
			script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
			script.async = true;
			script.defer = true;
			script.onload = initTurnstile;
			document.head.appendChild(script);
		} else {
			initTurnstile();
		}

		return () => {
			// @ts-ignore
			if (window.turnstile && widgetId !== undefined) {
				// @ts-ignore
				window.turnstile.remove(widgetId);
			}
		};
	});
</script>

<div bind:this={widgetContainer}></div>
