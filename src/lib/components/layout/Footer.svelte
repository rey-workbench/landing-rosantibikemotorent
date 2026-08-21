<script lang="ts">
	import { siteConfig } from '$lib/config';
	import { LL, locale } from '$i18n/i18n-svelte';
	import { page } from '$app/state';
	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	// Obfuscate email to prevent spam harvesting bots
	const emailUser = 'hello';
	const emailDomain = 'rosantibikemotorent.com';
	const displayEmail = $derived(`${emailUser}&#64;${emailDomain}`);
	const emailHref = $derived(`mailto:${emailUser}@${emailDomain}`);
</script>

<footer
	class="bg-[#f5f5f7] text-[#525257] text-[12px] pt-10 pb-12 border-t border-[#d2d2d7] {className}"
>
	<div class="max-w-5xl mx-auto px-4">
		<!-- Disclaimer / Breadcrumb note (Apple Style) -->
		<div class="text-[11px] text-[#525257] leading-relaxed pb-4 mb-6 border-b border-[#d2d2d7]">
			<p>
				Sewa motor harian, mingguan, dan bulanan terpercaya di Kota Malang, Batu, dan Bromo. Seluruh
				unit terawat resmi dengan fasilitas helm SNI dan jas hujan gratis.
			</p>
		</div>

		<!-- Main 4-Column Directory -->
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#d2d2d7]"
		>
			<!-- Col 1: About & Reviews -->
			<div class="space-y-3">
				<h2 class="font-semibold text-[#1d1d1f] text-[12px] tracking-tight">
					{siteConfig.shortName}
				</h2>
				<p class="leading-relaxed text-[12px] text-[#424245]">
					{$LL.footer_about()}
				</p>
				<div class="flex gap-3 pt-1">
					{#each [{ name: 'Instagram', url: siteConfig.socials.instagram, icon: 'M16.7 3h-9.4C4.4 3 2 5.4 2 8.3v9.4c0 2.9 2.4 5.3 5.3 5.3h9.4c2.9 0 5.3-2.4 5.3-5.3V8.3c0-2.9-2.4-5.3-5.3-5.3zm-4.7 15c-3.1 0-5.7-2.5-5.7-5.7s2.5-5.7 5.7-5.7 5.7 2.5 5.7 5.7-2.6 5.7-5.7 5.7zm5.5-10.4c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z' }, { name: 'Facebook', url: siteConfig.socials.facebook, icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }, { name: 'X (Twitter)', url: siteConfig.socials.twitter, icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' }] as social}
						<a
							href={social.url}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.name}
							class="text-[#525257] hover:text-[#1d1d1f] transition-colors"
						>
							<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
								<path d={social.icon} />
							</svg>
						</a>
					{/each}
				</div>
				<a
					href="https://share.google/txOxHDzSGQxVfc1ql"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d2d2d7] hover:border-black/30 transition-colors shadow-2xs"
				>
					<svg width="13" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
					<span class="font-medium text-[#1d1d1f] text-[11px]">5.0 on Google Reviews</span>
				</a>
			</div>

			<!-- Col 2: Jelajahi -->
			<div>
				<h2 class="font-semibold text-[#1d1d1f] mb-3 text-[12px] tracking-tight">
					{$LL.footer_explore() || 'Jelajahi'}
				</h2>
				<ul class="space-y-2.5">
					{#each [{ label: $LL.nav_home() || 'Home', href: `/${page.params.lang || $locale || 'id'}` }, { label: $LL.footer_catalog() || 'Katalog Motor', href: `/${page.params.lang || $locale || 'id'}/fleet` }, { label: $LL.footer_blog() || 'Blog', href: `/${page.params.lang || $locale || 'id'}/blog` }, { label: $LL.footer_procedure() || 'Cara Pesan', href: `/${page.params.lang || $locale || 'id'}/booking` }] as link}
						<li>
							<a
								href={link.href}
								aria-label={link.label}
								class="text-[#424245] hover:text-[#1d1d1f] hover:underline transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Col 3: Layanan -->
			<div>
				<h2 class="font-semibold text-[#1d1d1f] mb-3 text-[12px] tracking-tight">
					{$LL.footer_services() || 'Layanan'}
				</h2>
				<ul class="space-y-2.5 text-[#424245]">
					{#each [$LL.footer_daily_rental() || 'Sewa Motor Harian & Mingguan', $LL.footer_delivery() || 'Gratis Antar Jemput Stasiun/Terminal', $LL.footer_equipment() || 'Gratis 2 Helm SNI & Jas Hujan', $LL.footer_insurance() || 'Unit Terawat & Surat Lengkap'] as service}
						<li>
							{service}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Col 4: Kantor & Kontak -->
			<div>
				<h2 class="font-semibold text-[#1d1d1f] mb-3 text-[12px] tracking-tight">
					{$LL.footer_office() || 'Kantor'}
				</h2>
				<div class="space-y-2.5 text-[#424245]">
					<p>{siteConfig.address}</p>
					<p>
						<a href={emailHref} class="text-[#0066cc] hover:underline">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html displayEmail}
						</a>
					</p>
					<p>
						<a
							href="https://wa.me/{siteConfig.whatsapp}"
							class="text-[#424245] hover:text-[#1d1d1f] hover:underline"
						>
							{siteConfig.phone}
						</a>
					</p>
				</div>
			</div>
		</div>

		<!-- Apple Bottom Bar -->
		<div
			class="pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[11px] text-[#525257]"
		>
			<div>
				Copyright &copy; {new Date().getFullYear()}
				{siteConfig.name}. {$LL.footer_all_rights() || 'Hak cipta dilindungi.'}
			</div>

			<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
				<a
					href="/{page.params.lang || $locale || 'id'}/privacy"
					class="hover:text-[#1d1d1f] hover:underline transition-colors"
				>
					{$LL.footer_privacy() || 'Kebijakan Privasi'}
				</a>
				<span>|</span>
				<a
					href="/{page.params.lang || $locale || 'id'}/terms"
					class="hover:text-[#1d1d1f] hover:underline transition-colors"
				>
					{$LL.footer_terms() || 'Syarat & Ketentuan'}
				</a>
				<span>|</span>
				<span class="text-[#1d1d1f] font-medium">Indonesia</span>
			</div>
		</div>
	</div>
</footer>
