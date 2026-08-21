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
			const scriptId = 'cloudflare-turnstile-script';
			if (!document.getElementById(scriptId)) {
				const script = document.createElement('script');
				script.id = scriptId;
				script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
				script.async = true;
				script.defer = true;
				script.onload = initTurnstile;
				document.head.appendChild(script);
			} else {
				// Script exists but turnstile not ready, wait for it
				const existingScript = document.getElementById(scriptId) as HTMLScriptElement;
				const oldOnload = existingScript.onload;
				existingScript.onload = (e) => {
					if (typeof oldOnload === 'function') oldOnload.call(existingScript, e);
					initTurnstile();
				};
			}
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
