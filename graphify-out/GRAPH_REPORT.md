# Graph Report - landing (2026-07-06)

## Corpus Check

- 117 files · ~1,569,887 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 1427 nodes · 1599 edges · 86 communities (80 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `75cf3546`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]

## God Nodes (most connected - your core abstractions)

1. `Tailwind CSS Documentation` - 17 edges
2. `$lib/components/ui/Input.svelte` - 14 edges
3. `$lib/components/ui/PhoneInput.svelte` - 13 edges
4. `Node.js Best Practices` - 13 edges
5. `Node.js Backend Patterns` - 12 edges
6. `skills` - 11 edges
7. `WebSocketService` - 11 edges
8. `Tailwind CSS Development Patterns` - 11 edges
9. `scripts` - 10 edges
10. `compilerOptions` - 10 edges

## Surprising Connections (you probably didn't know these)

- `processTransaksi()` --calls--> `formatDate()` [EXTRACTED]
  src/lib/api/transaksi.ts → src/lib/utils/format.ts
- `load()` --calls--> `loadLocaleAsync()` [EXTRACTED]
  src/routes/[lang]/+layout.ts → src/i18n/i18n-util.async.ts
- `load()` --calls--> `isLocale()` [EXTRACTED]
  src/routes/+layout.ts → src/i18n/i18n-util.ts
- `getLocale()` --calls--> `detectLocale()` [EXTRACTED]
  src/hooks.server.ts → src/i18n/i18n-util.ts
- `getLocale()` --calls--> `isLocale()` [EXTRACTED]
  src/hooks.server.ts → src/i18n/i18n-util.ts

## Communities (86 total, 6 thin omitted)

### Community 0 - "Community 0"

Cohesion: 0.04
Nodes (48): 10. Anti-Patterns to Avoid, 11. Decision Checklist, 1. Framework Selection (2025), 2. Runtime Considerations (2025), 3. Architecture Principles, 4. Error Handling Principles, 5. Async Patterns Principles, 6. Validation Principles (+40 more)

### Community 1 - "Community 1"

Cohesion: 0.04
Nodes (48): Basic Page Data Typing, code:ts (// +page.js - DANGEROUS: runs in browser!), code:ts (// +page.server.ts), code:svelte (<!-- +error.svelte -->), code:ts (import { error } from '@sveltejs/kit';), code:ts (import { fail } from '@sveltejs/kit';), code:ts (import { fail, error } from '@sveltejs/kit';), code:ts (interface FormErrors {) (+40 more)

### Community 2 - "Community 2"

Cohesion: 0.04
Nodes (48): 1. Generics, 1. Infer Keyword, 2. Conditional Types, 2. Type Guards, 3. Assertion Functions, 3. Mapped Types, 4. Template Literal Types, 5. Utility Types (+40 more)

### Community 3 - "Community 3"

Cohesion: 0.09
Nodes (31): en, initFormatters(), { locale, LL, setLocale }, BaseLocale, BaseTranslation, Formatters, Locales, RootTranslation (+23 more)

### Community 4 - "Community 4"

Cohesion: 0.04
Nodes (44): Asset Import Queries, Built-in Constants, code:ts (const modules = import.meta.glob('./dir/*.ts')), code:ts (import inlined from './small.png?inline' // Force base64 ), code:ts (import Worker from './worker.ts?worker'), code:ts (const worker = new Worker(new URL('./worker.ts', import.meta), code:ts (import.meta.env.MODE // 'development' | 'production' | ), code:block14 (# .env) (+36 more)

### Community 5 - "Community 5"

Cohesion: 0.04
Nodes (44): Avoid Generic Keys, Basic Event Handlers, Basic Event Pattern, Callback Props Pattern, Capture, Passive, and NonPassive, code:svelte (<button on:click={handleClick}>Click</button>), code:svelte (<script lang="ts">), code:svelte (<!-- Button.svelte -->) (+36 more)

### Community 6 - "Community 6"

Cohesion: 0.04
Nodes (44): Async State Pattern, Automated Migration, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:bash (npx sv migrate svelte-5), code:svelte (<script>) (+36 more)

### Community 7 - "Community 7"

Cohesion: 0.05
Nodes (42): computedHash, source, sourceType, computedHash, source, sourceType, computedHash, source (+34 more)

### Community 8 - "Community 8"

Cohesion: 0.05
Nodes (42): Applying Variants in CSS, Arbitrary Values, code:bash (# Create a new Vite project), code:html, code:css (/* Manual dark mode toggle with class selector */), code:html, code:javascript (// Dark mode toggle logic), code:html (+34 more)

### Community 9 - "Community 9"

Cohesion: 0.05
Nodes (36): Background Colors, code:html (<div class="flex items-center justify-between">), code:html (<div class="pt-4 pr-8 pb-4 pl-8">), code:html (<div class="px-4 py-8">), code:html (<div class="p-4 md:p-8 lg:p-12">), code:html (<div class="space-y-4">), code:html (<h1 class="text-4xl font-bold">Large Heading</h1>), code:html (<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">) (+28 more)

### Community 10 - "Community 10"

Cohesion: 0.06
Nodes (35): Basic Snippet Rendering, code:svelte (<div class="card"><slot /></div>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>) (+27 more)

### Community 11 - "Community 11"

Cohesion: 0.06
Nodes (34): API Response Format, Architectural Patterns, Authentication & Authorization, Authentication Middleware, Best Practices, Caching Strategies, code:typescript (import express, { Request, Response, NextFunction } from "ex), code:typescript (// middleware/logger.middleware.ts) (+26 more)

### Community 12 - "Community 12"

Cohesion: 0.06
Nodes (31): Basic Generic Component, Basic Props Typing, Callback Props Typing, Children and Snippets Typing, code:svelte (<script lang="ts">), code:svelte (<script lang="ts" generics="K, V">), code:svelte (<script lang="ts" generics="T extends { id: string | number ), code:svelte (<script lang="ts" generics="T = Record<string, unknown>">) (+23 more)

### Community 13 - "Community 13"

Cohesion: 0.07
Nodes (29): devDependencies, prettier, prettier-plugin-svelte, svelte, svelte-check, @sveltejs/adapter-auto, @sveltejs/kit, @sveltejs/vite-plugin-svelte (+21 more)

### Community 14 - "Community 14"

Cohesion: 0.07
Nodes (29): Basic Structure, Client-Server Communication, code:ts (function myPlugin(): Plugin {), code:ts (import { msg } from 'virtual:my-module'), code:ts ({), code:ts ({), code:ts (transform(code, id) {), code:ts (configureServer(server) {) (+21 more)

### Community 15 - "Community 15"

Cohesion: 0.08
Nodes (23): Async Config, Basic Setup, build.target, code:ts (// vite.config.ts), code:js (/** @type {import('vite').UserConfig} */), code:ts (import type { UserConfig } from 'vite'), code:ts (export default defineConfig(({ command, mode, isSsrBuild, is), code:ts (export default defineConfig(async ({ command, mode }) => {) (+15 more)

### Community 16 - "Community 16"

Cohesion: 0.08
Nodes (23): Buttons, code:html (<button>Label</button>), code:html (<a href="/page">Descriptive link text</a>), code:html (<label for="email">Email address</label>), code:html (<label for="email">Email</label>), code:html (<nav aria-label="Main">), code:html (<div role="dialog" aria-modal="true" aria-labelledby="dialog), code:html (<!-- Polite (waits for pause in speech) -->) (+15 more)

### Community 17 - "Community 17"

Cohesion: 0.08
Nodes (23): Best Practices, Classes Not Applying, code:html (<!-- Center content -->), code:tsx (function ProductCard({ product }: { product: Product }) {), code:html (<div class="bg-white dark:bg-gray-900 text-gray-900 dark:tex), code:html (<input), Common Patterns, Constraints and Warnings (+15 more)

### Community 18 - "Community 18"

Cohesion: 0.09
Nodes (22): Accessibility Checklist, Alert Dialog, ARIA Patterns with Tailwind, code:html (<!-- Custom focus styles that meet WCAG AA -->), code:html (<!-- Only show focus ring on keyboard navigation -->), code:html (<!-- Semantic buttons with ARIA labels -->), code:html (<span class="sr-only">Opens in new window</span>), code:html (<!-- Ensure sufficient contrast ratios -->) (+14 more)

### Community 19 - "Community 19"

Cohesion: 0.09
Nodes (22): build, Build and SSR, code:ts (// vite.config.ts), code:ts (build: {), code:json ({), code:ts (export default defineConfig({), code:ts (import { createServer } from 'vite'), code:ts (import { build } from 'vite') (+14 more)

### Community 20 - "Community 20"

Cohesion: 0.09
Nodes (22): Advanced v4.1 Features, code:css (/* src/styles.css _/), code:javascript (/_* @type {import('tailwindcss').Config} */), code:javascript (// vite.config.ts), code:html (<div class="bg-[var(--color-brand-500)] text-[var(--color-wh), code:html (<!-- Complex grid with custom tracks -->), code:css (@utility content-auto {), code:javascript (// tailwind.config.js) (+14 more)

### Community 21 - "Community 21"

Cohesion: 0.10
Nodes (19): Accessibility Code Patterns, ARIA tabs, code:javascript (function openModal(modal) {), code:javascript (function showNotification(message, type = 'polite') {), code:html (<body>), code:css (.skip-link {), code:html (<form novalidate>), code:javascript (form.addEventListener('submit', (e) => {) (+11 more)

### Community 22 - "Community 22"

Cohesion: 0.10
Nodes (19): Basic Dark Mode Support, code:html (<div class="container mx-auto px-4">), code:html (<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 l), code:tsx (function ProductCard({ product }: { product: Product }) {), code:html (<div class="bg-white dark:bg-gray-900 text-gray-900 dark:tex), code:javascript (module.exports = {), code:tsx (function ThemeToggle() {), code:css (/* Global transition for theme changes */) (+11 more)

### Community 23 - "Community 23"

Cohesion: 0.10
Nodes (19): code:ts (// Before (Vite 7)), code:ts (// Before (Vite 7)), code:ts (export default defineConfig({), code:ts (export default defineConfig({), code:ts ({), code:bash (# Step 1: Test with rolldown-vite), code:json ({), Config Migration (+11 more)

### Community 24 - "Community 24"

Cohesion: 0.19
Nodes (15): $i18n/i18n-svelte, $lib/stores/imageCache, $lib/utils/format, rect, addEventListener(), slides, startMobileSlides(), svelte/motion (+7 more)

### Community 25 - "Community 25"

Cohesion: 0.11
Nodes (18): API Response Format, Authentication & Authorization, Caching Strategies, code:typescript (// di-container.ts), code:typescript (// config/database.ts), code:typescript (// config/mongoose.ts), code:typescript (// services/order.service.ts), code:typescript (// services/auth.service.ts) (+10 more)

### Community 26 - "Community 26"

Cohesion: 0.11
Nodes (17): Basic Transitions, Built-in Animations, code:html (<button class="bg-blue-500 hover:bg-blue-700 transition dura), code:html (<!-- Scale on hover -->), code:html (<div class="animate-spin">Spinning</div>), code:html (<!-- Loading spinner -->), code:css (/* In your CSS with @theme */), code:html (<div class="animate-fade-in">Fades in on load</div>) (+9 more)

### Community 27 - "Community 27"

Cohesion: 0.16
Nodes (9): load(), buildOrganizationSchema(), BASE_URL, BreadcrumbItem, FaqItem, ProductOffer, SeoMeta, SITE_NAME (+1 more)

### Community 28 - "Community 28"

Cohesion: 0.16
Nodes (11): motorAvailability, MotorStatusUpdateHandler, socketConnected, transactionUpdate, TransactionUpdateHandler, UnitMotorUpdateHandler, ConnectionState, JenisMotor (+3 more)

### Community 29 - "Community 29"

Cohesion: 0.13
Nodes (15): code:css (/* ✅ Minimum target size _/), code:javascript (// Allow users to extend time limits), code:css (/_ Respect reduced motion preference _/), code:javascript (// ❌ Only handles click), code:css (/_ ❌ Never remove focus outlines _/), code:css (/_ ✅ Account for sticky headers when scrolling to focused el), Dragging movements (2.5.7) — new in 2.2, Focus not obscured (2.4.11) — new in 2.2 (+7 more)

### Community 30 - "Community 30"

Cohesion: 0.13
Nodes (14): code:javascript (// tailwind.config.js), code:html (<!-- Use content-visibility for offscreen content -->), code:css (/* Enable CSS-first configuration in v4.1 */), code:javascript (// tailwind.config.js), code:bash (# Use cssnano for minification), Best Practices for Performance, Bundle Size Optimization, Content Path Best Practices (+6 more)

### Community 31 - "Community 31"

Cohesion: 0.13
Nodes (14): Backward Compatibility, Basic Configuration, code:ts (export default defineConfig({), code:ts (export default defineConfig({), code:ts (interface EnvironmentOptions {), code:ts (import { customEnvironment } from 'vite-environment-provider), code:ts ({), Concept (+6 more)

### Community 32 - "Community 32"

Cohesion: 0.13
Nodes (14): Callback Props (replacing createEventDispatcher), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<!-- Svelte 5: use onclick, not on:click -->), code:svelte (<script>), Common Mistakes, Component Props (+6 more)

### Community 33 - "Community 33"

Cohesion: 0.14
Nodes (13): Card Component, code:html (<div class="bg-white rounded-lg shadow-lg overflow-hidden">), code:html (<div class="max-w-sm mx-auto bg-white rounded-xl shadow-lg o), code:html (<nav class="bg-white shadow-lg">), code:html (<form class="space-y-6 max-w-md mx-auto">), code:html (<div class="fixed inset-0 bg-black bg-opacity-50 flex items-), code:tsx (import { useState } from 'react';), Form Elements (+5 more)

### Community 34 - "Community 34"

Cohesion: 0.15
Nodes (9): $lib/stores/loading, $lib/components/ui/Input.svelte, $lib/components/ui/Preloader.svelte, $lib/components/ui/StepIndicator.svelte, svelte/transition, daysInMo, mins, prevDaysInMo (+1 more)

### Community 35 - "Community 35"

Cohesion: 0.21
Nodes (4): jenisMotorApi, ProcessedJenisMotor, ./$types, UnitMotor

### Community 36 - "Community 36"

Cohesion: 0.15
Nodes (13): Anti-Pattern 2: Circular Dependencies, Anti-Pattern 3: Not Using untrack, Anti-Pattern 4: Heavy Computations in $derived, Anti-Pattern 5: Effect for DOM Manipulation, Avoiding Over-Reactivity, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>) (+5 more)

### Community 37 - "Community 37"

Cohesion: 0.15
Nodes (13): Basic Component Test, code:ts (// vitest.config.ts), code:ts (// vitest.config.ts), code:ts (import { render, screen, fireEvent } from '@testing-library/), code:ts (test('renders with custom name', () => {), code:ts (import { vi } from 'vitest';), code:ts (import { waitFor } from '@testing-library/svelte';), Component Testing (+5 more)

### Community 38 - "Community 38"

Cohesion: 0.22
Nodes (9): ../app.css, $i18n/i18n-types, $i18n/i18n-util, $lib/config, $lib/services/websocket, $app/navigation, $lib/components/layout/Footer.svelte, $lib/components/layout/Navbar.svelte (+1 more)

### Community 39 - "Community 39"

Cohesion: 0.17
Nodes (12): Accessible authentication (3.3.8) — new in 2.2, code:html (<!-- ❌ No language specified -->), code:html (<!-- Navigation should be consistent across pages -->), code:html (<!-- ✅ Auto-fill shipping address from billing -->), code:html (<!-- ✅ Allow paste in password fields -->), Consistent help (3.2.6) — new in 2.2, Consistent navigation (3.2.3), Error handling (3.3.1, 3.3.3) (+4 more)

### Community 40 - "Community 40"

Cohesion: 0.18
Nodes (8): CalculatePriceDto, CreateTransaksiDto, ProcessedTransaksi, processTransaksi(), transaksiApi, PriceCalculation, StatusTransaksi, Transaksi

### Community 41 - "Community 41"

Cohesion: 0.20
Nodes (6): unitMotorApi, API_ENDPOINTS, PAGINATION, STATUS_TRANSAKSI, WEBSOCKET_URL, siteConfig

### Community 42 - "Community 42"

Cohesion: 0.24
Nodes (8): ProcessedBlogPost, processPost(), BlogKategori, BlogPost, BlogTag, StatusArtikel, formatDate(), stripHtml()

### Community 43 - "Community 43"

Cohesion: 0.17
Nodes (11): compilerOptions, allowJs, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, resolveJsonModule, skipLibCheck (+3 more)

### Community 44 - "Community 44"

Cohesion: 0.17
Nodes (11): Basic Usage, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), Complex Derivations with $derived.by, $derived - Computed Values, $derived vs $effect (+3 more)

### Community 45 - "Community 45"

Cohesion: 0.17
Nodes (12): Article, Breadcrumbs, code:html (<script type="application/ld+json">), code:html (<script type="application/ld+json">), code:html (<script type="application/ld+json">), code:html (<script type="application/ld+json">), code:html (<script type="application/ld+json">), FAQ (+4 more)

### Community 46 - "Community 46"

Cohesion: 0.17
Nodes (9): $lib/seo/schema, dependencies, clsx, isomorphic-dompurify, lenis, socket.io-client, tailwind-merge, @types/dompurify (+1 more)

### Community 47 - "Community 47"

Cohesion: 0.18
Nodes (9): breadcrumbSchema, currentUrl, displayPrice, fetchMotor(), jenis, lang, productSchema, refresh() (+1 more)

### Community 48 - "Community 48"

Cohesion: 0.17
Nodes (11): CLI Tools, code:bash (npx @sveltejs/mcp list-sections), code:bash (npx @sveltejs/mcp get-documentation "<section1>,<section2>,.), code:bash (npx @sveltejs/mcp get-documentation "$state,$derived,$effect), code:bash (npx @sveltejs/mcp svelte-autofixer "<code_or_path>" [options), code:bash (# Analyze inline code (escape $ as \$)), Get Documentation, List Documentation Sections (+3 more)

### Community 49 - "Community 49"

Cohesion: 0.17
Nodes (11): Advanced, Build & SSR, CLI Commands, code:bash (vite # Start dev server), code:ts (import { defineConfig } from 'vite'), Common Config, Core, Official Plugins (+3 more)

### Community 50 - "Community 50"

Cohesion: 0.18
Nodes (11): Basic Effect with Cleanup, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), DOM Event Listeners, $effect.pre for Pre-DOM Updates (+3 more)

### Community 51 - "Community 51"

Cohesion: 0.18
Nodes (11): Basic Usage, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script lang="ts">), code:svelte (<script lang="ts">), $props - Component Props, Props with Children (+3 more)

### Community 52 - "Community 52"

Cohesion: 0.18
Nodes (11): code:html (<!-- ❌ Poor structure -->), code:html (<!-- ❌ Poor image SEO -->), code:html (<!-- ❌ Non-descriptive -->), code:html (<!-- ❌ Missing or generic -->), code:html (<!-- ❌ Missing or duplicate -->), Heading structure, Image SEO, Internal linking (+3 more)

### Community 54 - "Community 54"

Cohesion: 0.18
Nodes (9): libphonenumber-js, $lib/components/ui/PhoneInput.svelte, codePoints, digits, matchedCountry, normalized, parsed, raw (+1 more)

### Community 55 - "Community 55"

Cohesion: 0.24
Nodes (4): imageCache, loadingState, isLoaded, loadingProgress

### Community 56 - "Community 56"

Cohesion: 0.20
Nodes (10): code:html (<!-- ❌ Missing alt -->), code:html (<!-- ❌ No accessible name -->), code:css (.visually-hidden {), code:css (/* ❌ Low contrast (2.5:1) */), code:html (<!-- ❌ Only color indicates error -->), code:html (<!-- Video with captions -->), Color contrast (1.4.3, 1.4.6), Media alternatives (1.2) (+2 more)

### Community 57 - "Community 57"

Cohesion: 0.31
Nodes (3): api, ApiClient, $app/environment

### Community 58 - "Community 58"

Cohesion: 0.20
Nodes (3): blogApi, SitemapUrl, staticUrls

### Community 59 - "Community 59"

Cohesion: 0.20
Nodes (10): Anti-Pattern: Waterfall, code:ts (export const load = async ({ fetch }) => {), code:ts (export const load = async ({ fetch }) => {), code:ts (export const load = async ({ fetch }) => {), code:ts (export const load = async ({ fetch }) => {), Pattern 1: Parallel with Promise.all, Pattern 2: Partial Dependencies, Pattern 3: Streaming Non-Critical Data (+2 more)

### Community 60 - "Community 60"

Cohesion: 0.20
Nodes (9): Basic Streaming, code:ts (export const load = async ({ fetch }) => {), code:ts (export const load = async ({ fetch }) => {), code:svelte (<script lang="ts">), Component Handling, Streaming Non-Critical Data, Svelte 5 Performance Reference, Table of Contents (+1 more)

### Community 61 - "Community 61"

Cohesion: 0.20
Nodes (9): code:html (<!-- For multi-language sites -->), code:html (<html lang="en">), Hreflang tags, International SEO, Language declaration, References, SEO fundamentals, SEO optimization (+1 more)

### Community 62 - "Community 62"

Cohesion: 0.44
Nodes (6): $i18n/i18n-svelte.js, $lib/api, $lib/components/seo, $lib/types, $lib/components/ui/Button.svelte, $app/stores

### Community 63 - "Community 63"

Cohesion: 0.22
Nodes (8): Accessibility (a11y), Common issues by impact, Conformance levels, Critical (fix immediately), Moderate (fix soon), References, Serious (fix before launch), WCAG Principles: POUR

### Community 64 - "Community 64"

Cohesion: 0.22
Nodes (8): Building, code:sh (# create a new project), code:sh (# recreate this project), code:sh (npm run dev), code:sh (npm run build), Creating a project, Developing, sv

### Community 65 - "Community 65"

Cohesion: 0.22
Nodes (9): code:ts (// counter.svelte.ts), code:svelte (<script>), code:ts (// user.svelte.ts), code:ts (// todo.svelte.ts), Important Notes, Object State with Getters, Reactive Class Pattern, Shared Counter State (+1 more)

### Community 66 - "Community 66"

Cohesion: 0.22
Nodes (9): Basic Usage, Class State, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), Object and Array State, Raw State (Opt-out of Deep Reactivity) (+1 more)

### Community 67 - "Community 67"

Cohesion: 0.22
Nodes (9): Basic Usage, code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), code:svelte (<script>), Custom Logging with $inspect.with, Debugging with Breakpoints, $inspect - Debugging (+1 more)

### Community 68 - "Community 68"

Cohesion: 0.22
Nodes (9): Basic Usage, $bindable - Two-Way Binding, Bindable with Default Value, code:svelte (<!-- Input.svelte -->), code:svelte (<script>), code:svelte (<script>), code:svelte (<script lang="ts">), Multiple Bindable Props (+1 more)

### Community 69 - "Community 69"

Cohesion: 0.25
Nodes (8): code:xml (<?xml version="1.0" encoding="UTF-8"?>), code:block5 (✅ Good URLs:), code:html (<!-- Ensure all resources use HTTPS -->), code:block7 (Strict-Transport-Security: max-age=31536000; includeSubDomai), HTTPS & security, Technical SEO, URL structure, XML sitemap

### Community 70 - "Community 70"

Cohesion: 0.29
Nodes (7): code:html (<!-- ❌ Not mobile-friendly -->), code:css (/* ❌ Too small for mobile _/), code:css (/_ ❌ Too small on mobile */), Font sizes, Mobile SEO, Responsive design, Tap targets

### Community 71 - "Community 71"

Cohesion: 0.40
Nodes (5): Critical, High priority, Medium priority, Ongoing, SEO audit checklist

### Community 72 - "Community 72"

Cohesion: 0.50
Nodes (4): ARIA usage (4.1.2), code:html (<!-- ❌ ARIA role on div -->), Live regions (4.1.3), Robust

### Community 73 - "Community 73"

Cohesion: 0.50
Nodes (4): Automated testing, code:bash (# Lighthouse accessibility audit), Manual testing, Testing checklist

### Community 74 - "Community 74"

Cohesion: 0.50
Nodes (3): ApiResponse, PaginatedResponse, PaginationMeta

### Community 75 - "Community 75"

Cohesion: 0.50
Nodes (4): code:text (# /robots.txt), code:html (<!-- Default: indexable, followable -->), code:html (<!-- Prevent duplicate content issues -->), Crawlability

### Community 78 - "Community 78"

Cohesion: 0.67
Nodes (3): code:svelte (<script>), Anti-Pattern 1: Using $effect to Set Derived Values, code:svelte (<script>)

## Knowledge Gaps

- **687 isolated node(s):** `adapter`, `$schema`, `name`, `private`, `version` (+682 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `svelte` connect `Community 13` to `Community 24`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `$lib/components/landing/HeroVideo.svelte` connect `Community 24` to `Community 34`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `adapter`, `$schema`, `name` to the rest of the system?**
  _687 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09158186864014801 - nodes in this community are weakly interconnected._
