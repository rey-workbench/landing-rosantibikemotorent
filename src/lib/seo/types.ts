export interface SeoMeta {
	title?: string;
	description?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: 'website' | 'article' | 'product';
	canonicalUrl?: string;
	twitterCard?: 'summary' | 'summary_large_image';
	twitterTitle?: string;
	twitterDescription?: string;
	twitterImage?: string;
	robots?: 'index, follow' | 'noindex, nofollow' | 'index, nofollow';
	articlePublishedTime?: string;
	articleAuthor?: string;
}

export interface BreadcrumbItem {
	position: number;
	name: string;
	item: string;
}

export interface ProductOffer {
	price: number;
	priceCurrency: string;
	availability: 'InStock' | 'OutOfStock';
	url: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export type SupportedLocale = 'id' | 'en';

export const BASE_URL = 'https://rosantibikeamotorent.com' as const;
export const SITE_NAME = 'Rosantibike Motorent' as const;
