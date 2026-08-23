import api from './client';
import { DEFAULTS } from '$lib/constants';

export interface FaqItem {
	question: string;
	answer: string;
}

export const knowledgeApi = {
	// FAQ publik dari knowledge base backend (kategori 'faq') — dikelola admin di halaman AI
	getFaq: async (customFetch?: typeof fetch): Promise<FaqItem[]> => {
		const { data: body } = await api.get('/ai/knowledge/public', {
			params: { category: 'faq' },
			customFetch,
			ttl: DEFAULTS.GET_TTL_MS
		});
		return body.data;
	}
};
