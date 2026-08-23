import { siteConfig } from '$lib/config';
import type { BreadcrumbItem, FaqItem } from './types';
import { BASE_URL, SITE_NAME } from './types';

export interface FleetMotor {
	name: string;
	brand: string;
	category: string;
	description: string;
	image: string;
	price: string;
}

export function buildOrganizationSchema(fleet: FleetMotor[] = []) {
	return {
		'@context': 'https://schema.org',
		'@type': ['LocalBusiness', 'AutoRental'],
		name: SITE_NAME,
		alternateName: 'Rosantibike Motorent',
		url: `${BASE_URL}/`,
		logo: `${BASE_URL}/favicon.svg`,
		image: `${BASE_URL}/logo.webp`,
		telephone: siteConfig.phone,
		description:
			'Penyedia layanan sewa motor murah dan rental motor premium di Malang. Menyediakan armada PCX 150, Lexi 125, Vario 150, Vario 125, Scoopy, Beat Fi, dan Soul GT dengan fasilitas 2 helm dan jas hujan.',
		email: siteConfig.email,
		currenciesAccepted: 'IDR',
		paymentAccepted: 'Cash, Bank Transfer, QRIS',
		priceRange: 'Rp 80.000 - Rp 150.000',
		areaServed: [
			{
				'@type': 'City',
				name: 'Malang',
				sameAs: 'https://www.wikidata.org/wiki/Q11025'
			},
			{
				'@type': 'City',
				name: 'Batu',
				sameAs: 'https://www.wikidata.org/wiki/Q131346'
			}
		],
		address: {
			'@type': 'PostalAddress',
			streetAddress: siteConfig.address,
			addressLocality: 'Malang',
			addressRegion: 'Jawa Timur',
			postalCode: '65142',
			addressCountry: 'ID'
		},
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: siteConfig.phone,
			contactType: 'customer service',
			availableLanguage: ['Indonesian', 'English']
		},
		sameAs: [
			siteConfig.socials.facebook,
			siteConfig.socials.instagram,
			'https://share.google/txOxHDzSGQxVfc1ql',
			'https://www.wikidata.org/wiki/Q11025',
			'https://en.wikipedia.org/wiki/Malang'
		],
		knowsAbout: [
			'Sewa Motor Malang',
			'Rental Motor Malang',
			'Rental Motor Stasiun Malang',
			'Sewa Motor Bromo',
			'Sewa Motor Kota Batu'
		],
		geo: {
			'@type': 'GeoCoordinates',
			latitude: -7.9463,
			longitude: 112.6565
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
				opens: '06:00',
				closes: '22:00'
			}
		],
		...(fleet.length > 0 && {
			hasOfferCatalog: {
				'@type': 'OfferCatalog',
				name: 'Katalog Sewa Motor Malang',
				itemListElement: fleet.map((motor) => ({
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Product',
						name: motor.name,
						brand: { '@type': 'Brand', name: motor.brand },
						category: motor.category,
						description: motor.description,
						image: motor.image,
						offers: {
							'@type': 'Offer',
							price: motor.price,
							priceCurrency: 'IDR',
							availability: 'https://schema.org/InStock',
							hasMerchantReturnPolicy: {
								'@type': 'MerchantReturnPolicy',
								applicableCountry: 'ID',
								returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
								merchantReturnDays: 0
							},
							shippingDetails: {
								'@type': 'OfferShippingDetails',
								shippingDestination: {
									'@type': 'DefinedRegion',
									addressCountry: 'ID',
									addressRegion: 'Jawa Timur'
								},
								shippingRate: {
									'@type': 'MonetaryAmount',
									value: 0,
									currency: 'IDR'
								}
							}
						}
					}
				}))
			}
		})
	};
}

export function buildWebsiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		alternateName: 'Rosantibike',
		url: BASE_URL
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

export function buildVideoSchema(params: {
	name: string;
	description: string;
	thumbnailUrl: string;
	contentUrl: string;
	uploadDate: string;
	duration?: string;
}) {
	const { name, description, thumbnailUrl, contentUrl, uploadDate, duration } = params;

	return {
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name,
		description,
		thumbnailUrl,
		contentUrl,
		uploadDate,
		...(duration && { duration })
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
