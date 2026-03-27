<script lang="ts">
	import { siteConfig } from '$lib/config';
	import { LL, locale } from '$i18n/i18n-svelte';
	import { page } from '$app/state';
	export let className = '';
</script>

<footer class="bg-black border-t border-white/5 pt-20 pb-10 {className}">
	<div class="max-w-7xl mx-auto px-6">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
			<div class="space-y-6">
				<h2 class="text-2xl font-black uppercase tracking-tighter text-white">
					{siteConfig.shortName}
				</h2>
				<p class="text-gray-500 text-sm leading-relaxed max-w-xs">
					{$LL.footer_about()}
				</p>
				<div class="flex gap-4">
					{#each [{ name: 'Instagram', url: siteConfig.socials.instagram, icon: 'M16.7 3h-9.4C4.4 3 2 5.4 2 8.3v9.4c0 2.9 2.4 5.3 5.3 5.3h9.4c2.9 0 5.3-2.4 5.3-5.3V8.3c0-2.9-2.4-5.3-5.3-5.3zm-4.7 15c-3.1 0-5.7-2.5-5.7-5.7s2.5-5.7 5.7-5.7 5.7 2.5 5.7 5.7-2.6 5.7-5.7 5.7zm5.5-10.4c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z' }, { name: 'Facebook', url: siteConfig.socials.facebook, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }] as social}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.name}
							class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
						>
							<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="text-white font-bold uppercase tracking-widest text-xs mb-8">
					{$LL.footer_explore()}
				</h3>
				<ul class="space-y-4">
					{#each [{ label: $LL.footer_home(), href: `/${page.params.lang || $locale}` }, { label: $LL.footer_catalog(), href: `/${page.params.lang || $locale}/fleet` }, { label: $LL.footer_blog(), href: `/${page.params.lang || $locale}/blog` }, { label: $LL.footer_procedure(), href: `/${page.params.lang || $locale}/booking` }] as link}
						<li>
							<a
								href={link.href}
								class="text-gray-500 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="text-white font-bold uppercase tracking-widest text-xs mb-8">
					{$LL.footer_services()}
				</h3>
				<ul class="space-y-4">
					{#each [$LL.footer_daily_rental(), $LL.footer_delivery(), $LL.footer_equipment(), $LL.footer_insurance()] as service}
						<li class="flex items-center gap-3 text-gray-500 text-sm">
							<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
							{service}
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="text-white font-bold uppercase tracking-widest text-xs mb-8">
					{$LL.footer_office()}
				</h3>
				<div class="space-y-6">
					<div class="flex items-start gap-4">
						<div class="mt-1 text-blue-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
									cx="12"
									cy="10"
									r="3"
								/></svg
							>
						</div>
						<p class="text-gray-500 text-sm leading-relaxed">
							{siteConfig.address}
						</p>
					</div>
					<div class="flex items-center gap-4">
						<div class="text-green-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect width="20" height="16" x="2" y="4" rx="2" /><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								/></svg
							>
						</div>
						<a
							href="mailto:{siteConfig.email}"
							class="text-gray-500 hover:text-white transition-colors text-sm"
						>
							{siteConfig.email}
						</a>
					</div>
					<div class="flex items-center gap-4">
						<div class="text-blue-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								/></svg
							>
						</div>
						<a
							href="https://wa.me/{siteConfig.whatsapp}"
							class="text-gray-500 hover:text-white transition-colors text-sm"
						>
							{siteConfig.phone}
						</a>
					</div>
				</div>
			</div>
		</div>

		<div
			class="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
		>
			<div class="text-[11px] uppercase tracking-[0.2em] text-gray-600 font-bold">
				&copy; {new Date().getFullYear()}
				{siteConfig.name}. {$LL.footer_all_rights()}
			</div>
			<div class="flex items-center gap-8">
				<a
					href="/{page.params.lang || $locale}/privacy"
					aria-label={$LL.footer_privacy()}
					class="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
					>{$LL.footer_privacy()}</a
				>
				<a
					href="/{page.params.lang || $locale}/terms"
					aria-label={$LL.footer_terms()}
					class="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
					>{$LL.footer_terms()}</a
				>
			</div>
		</div>
	</div>
</footer>
