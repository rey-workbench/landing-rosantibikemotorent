<script lang="ts">
	import { locale } from '$i18n/i18n-svelte';
	import { locales } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const names: Record<string, string> = {
		en: 'EN',
		id: 'ID'
	};

	// Use the URL param as the source of truth for the active state
	const currentLang = $derived((page.params.lang as Locales) || $locale);

	function switchLanguage(lang: Locales) {
		document.cookie = `locale=${lang}; path=/; max-age=31536000`;

		const segments = window.location.pathname.split('/');
		// If the first segment is an existing locale, replace it
		if (segments[1] && locales.includes(segments[1] as Locales)) {
			segments[1] = lang;
		} else {
			// Otherwise prefix it (this handles the root / or other edge cases)
			segments.splice(1, 0, lang);
		}

		goto(segments.join('/') || `/${lang}`);
	}
</script>

<div class="flex items-center gap-2">
	{#each locales as lang}
		<button
			onclick={() => switchLanguage(lang)}
			class="px-3 py-1 text-xs font-black rounded-full border transition-all duration-300 {currentLang ===
			lang
				? 'bg-white text-black border-white'
				: 'text-white/40 border-white/10 hover:border-white/40 hover:text-white'}"
			aria-current={currentLang === lang ? 'page' : undefined}
		>
			{names[lang] || lang.toUpperCase()}
		</button>
	{/each}
</div>
