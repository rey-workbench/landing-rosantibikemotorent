import type { BreadcrumbItem, FaqItem, SupportedLocale } from './types';
import { BASE_URL, SITE_NAME } from './types';
import { siteConfig } from '$lib/config';

export function buildOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'AutoRental',
		name: SITE_NAME,
		alternateName: 'Rosantibike Motorent',
		url: BASE_URL,
		logo: `${BASE_URL}/favicon.svg`,
		description:
			'Premium motorcycle rental service in Malang, East Java, Indonesia. Well-maintained units, 24/7 service, and free delivery to stations, terminals, and hotels.',
		areaServed: { '@type': 'City', name: 'Malang' },
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Jl. Bauksit No.90C',
			addressLocality: 'Malang',
			addressRegion: 'East Java',
			postalCode: '65142',
			addressCountry: 'ID'
		},
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: siteConfig.phone,
			contactType: 'customer service',
			availableLanguage: ['Indonesian', 'English']
		},
		sameAs: ['https://www.instagram.com/rosantibike', 'https://share.google/txOxHDzSGQxVfc1ql'],
		priceRange: '$$',
		openingHoursSpecification: {
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			opens: '07:30',
			closes: '17:00'
		}
	};
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item) => ({
			'@type': 'ListItem',
			position: item.position,
			name: item.name,
			item: item.item
		}))
	};
}

export function buildProductSchema(params: {
	name: string;
	description: string;
	brand: string;
	image?: string;
	sku: string;
	mpn?: string;
	price: number;
	currency?: string;
	inStock?: boolean;
	url: string;
}) {
	const {
		name,
		description,
		brand,
		image,
		sku,
		mpn,
		price,
		currency = 'IDR',
		inStock = true,
		url
	} = params;

	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name,
		description,
		brand: { '@type': 'Brand', name: brand },
		...(image && { image }),
		sku,
		...(mpn && { mpn }),
		offers: {
			'@type': 'Offer',
			price: price.toString(),
			priceCurrency: currency,
			availability: `https://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
			url
		}
	};
}

export function buildFaqSchema(faqs: FaqItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};
}

export function buildArticleSchema(params: {
	title: string;
	description: string;
	image?: string;
	author?: string;
	publishedTime?: string;
	url: string;
}) {
	const { title, description, image, author = SITE_NAME, publishedTime, url } = params;

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		...(image && { image }),
		author: { '@type': 'Person', name: author },
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` }
		},
		...(publishedTime && { datePublished: publishedTime }),
		url
	};
}

export function buildBreadcrumbItems(
	lang: SupportedLocale,
	pages: { name: string; path: string }[]
): BreadcrumbItem[] {
	return [
		{ position: 1, name: 'Home', item: `${BASE_URL}/${lang}` },
		...pages.map((page, index) => ({
			position: index + 2,
			name: page.name,
			item: `${BASE_URL}/${lang}${page.path}`
		}))
	];
}
