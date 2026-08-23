import { knowledgeApi } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const lang = (params.lang || 'id') as 'id' | 'en';

	// ponytail: knowledge base hanya bahasa Indonesia (untuk bot WA) — FAQ ID pakai
	// knowledge yang dikelola admin (kategori 'faq'); FAQ EN tetap hardcoded sampai
	// knowledge mendukung field bahasa. Gagal fetch → fallback ke hardcoded di +page.svelte.
	let faqKnowledge: { question: string; answer: string }[] = [];
	if (lang === 'id') {
		try {
			faqKnowledge = await knowledgeApi.getFaq(fetch);
		} catch {
			faqKnowledge = [];
		}
	}

	return { faqKnowledge };
};
