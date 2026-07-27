<script lang="ts">
	import { siteConfig } from '$lib/config';
	import { LL, locale } from '$i18n/i18n-svelte';
	import { page } from '$app/state';
	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();
</script>

<footer
	class="bg-[#f5f5f7] text-[#86868b] text-[11px] pt-8 pb-12 border-t border-black/5 {className}"
>
	<div class="max-w-5xl mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-black/10">
			<div class="space-y-3">
				<h2 class="font-semibold text-[#1d1d1f] text-xs">
					{siteConfig.shortName}
				</h2>
				<p class="leading-relaxed text-xs">
					{$LL.footer_about()}
				</p>
				<div class="flex gap-3 pt-2">
					{#each [{ name: 'Instagram', url: siteConfig.socials.instagram, icon: 'M16.7 3h-9.4C4.4 3 2 5.4 2 8.3v9.4c0 2.9 2.4 5.3 5.3 5.3h9.4c2.9 0 5.3-2.4 5.3-5.3V8.3c0-2.9-2.4-5.3-5.3-5.3zm-4.7 15c-3.1 0-5.7-2.5-5.7-5.7s2.5-5.7 5.7-5.7 5.7 2.5 5.7 5.7-2.6 5.7-5.7 5.7zm5.5-10.4c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z' }, { name: 'Facebook', url: siteConfig.socials.facebook, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }] as social}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.name}
							class="hover:text-[#1d1d1f] transition-colors"
						>
							<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="font-semibold text-[#1d1d1f] mb-3 text-xs">
					{$LL.footer_explore()}
				</h3>
				<ul class="space-y-2">
					{#each [{ label: $LL.nav_home(), href: `/${page.params.lang || $locale}` }, { label: $LL.footer_catalog(), href: `/${page.params.lang || $locale}/fleet` }, { label: $LL.footer_blog(), href: `/${page.params.lang || $locale}/blog` }, { label: $LL.footer_procedure(), href: `/${page.params.lang || $locale}/booking` }] as link}
						<li>
							<a href={link.href} class="hover:underline hover:text-[#1d1d1f] transition-colors">
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="font-semibold text-[#1d1d1f] mb-3 text-xs">
					{$LL.footer_services()}
				</h3>
				<ul class="space-y-2">
					{#each [$LL.footer_daily_rental(), $LL.footer_delivery(), $LL.footer_equipment(), $LL.footer_insurance()] as service}
						<li>
							{service}
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="font-semibold text-[#1d1d1f] mb-3 text-xs">
					{$LL.footer_office()}
				</h3>
				<div class="space-y-2">
					<p>{siteConfig.address}</p>
					<p>
						<a href="mailto:{siteConfig.email}" class="hover:underline hover:text-[#1d1d1f]"
							>{siteConfig.email}</a
						>
					</p>
					<p>
						<a
							href="https://wa.me/{siteConfig.whatsapp}"
							class="hover:underline hover:text-[#1d1d1f]">{siteConfig.phone}</a
						>
					</p>
				</div>
			</div>
		</div>

		<div class="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
			<div>
				Copyright &copy; {new Date().getFullYear()}
				{siteConfig.name}. {$LL.footer_all_rights()}
			</div>
			<div class="flex items-center gap-4">
				<a
					href="/{page.params.lang || $locale}/privacy"
					class="hover:underline hover:text-[#1d1d1f] transition-colors border-r border-black/20 pr-4"
					>{$LL.footer_privacy()}</a
				>
				<a
					href="/{page.params.lang || $locale}/terms"
					class="hover:underline hover:text-[#1d1d1f] transition-colors">{$LL.footer_terms()}</a
				>
			</div>
		</div>
	</div>
</footer>
