import { browser } from '$app/environment';
import { DEFAULTS } from '$lib/constants';

let rawUrl = import.meta.env.VITE_API_URL;
if (!rawUrl) {
	if (browser) {
		rawUrl = `${window.location.protocol}//${window.location.hostname}:${DEFAULTS.API_FALLBACK_PORT}/api`;
	} else if (import.meta.env.DEV) {
		rawUrl = `http://localhost:${DEFAULTS.API_FALLBACK_PORT}/api`;
	} else {
		rawUrl = 'https://api.rosantibikemotorent.com/api';
	}
}
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

function buildUrl(url: string, params?: any): string {
	const fetchUrl = `${API_BASE_URL}${url}`;
	if (!params) return fetchUrl;

	const searchParams = new URLSearchParams();
	for (const key in params) {
		const val = params[key];
		if (val !== undefined && val !== null) {
			searchParams.append(key, String(val));
		}
	}
	const qs = searchParams.toString();
	return qs ? `${fetchUrl}?${qs}` : fetchUrl;
}

function buildHeadersAndBody(data?: any, customHeaders?: any) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(customHeaders || {})
	};

	// Provide an Origin header during SSR to pass backend CORS checks
	if (!browser && !headers['Origin'] && !headers['origin']) {
		headers['Origin'] = 'https://rosantibikemotorent.com';
	}

	let body: BodyInit | undefined;
	if (data) {
		if (data instanceof FormData) {
			delete headers['Content-Type'];
			body = data;
		} else {
			body = JSON.stringify(data);
		}
	}
	return { headers, body };
}

async function parseResponse(response: Response) {
	const contentType = response.headers.get('content-type');
	const responseData =
		contentType && contentType.includes('application/json')
			? await response.json()
			: await response.text();

	if (!response.ok) {
		const error: any = new Error(responseData?.message || 'Request failed');
		error.response = {
			status: response.status,
			data: responseData
		};
		throw error;
	}

	return { data: responseData, status: response.status };
}

class ApiClient {
	private pendingGets = new Map<string, Promise<any>>();
	private responseCache = new Map<string, { expiresAt: number; data: any; status: number }>();

	private async performFetchOnce(
		fetchFn: typeof fetch,
		fetchUrl: string,
		method: string,
		headers: any,
		body: any,
		config: any
	) {
		const response = await fetchFn(fetchUrl, {
			method,
			headers,
			body,
			signal: config.signal
		});
		return await parseResponse(response);
	}

	private handleFetchError(error: any, attempts: number, maxAttempts: number) {
		if (error.name === 'AbortError') throw error;
		if (attempts >= maxAttempts) {
			if (browser && import.meta.env.DEV) {
				console.warn('[API Warning]', error.response?.status ?? 'network error');
			}
			throw error;
		}
	}

	private async performFetch(
		fetchFn: typeof fetch,
		fetchUrl: string,
		method: string,
		headers: any,
		body: any,
		config: any
	) {
		let attempts = 0;
		const maxAttempts = method === 'GET' ? DEFAULTS.REQUEST_MAX_ATTEMPTS : 1;
		while (attempts < maxAttempts) {
			attempts++;
			try {
				return await this.performFetchOnce(fetchFn, fetchUrl, method, headers, body, config);
			} catch (error: any) {
				this.handleFetchError(error, attempts, maxAttempts);
				// Small delay before retry for GET requests
				await new Promise((resolve) => setTimeout(resolve, DEFAULTS.REQUEST_RETRY_DELAY_MS));
			}
		}
	}

	async request(method: string, url: string, data?: any, config: any = {}) {
		const fetchUrl = buildUrl(url, config.params);
		const ttl = config.ttl ?? (method === 'GET' ? DEFAULTS.GET_TTL_MS : 0);
		const useCache = method === 'GET' && ttl > 0;

		if (useCache) {
			const cached = this.responseCache.get(fetchUrl);
			if (cached && cached.expiresAt > Date.now()) {
				return { data: cached.data, status: cached.status };
			}
		}

		if (method === 'GET') {
			if (this.pendingGets.has(fetchUrl)) {
				return this.pendingGets.get(fetchUrl);
			}
		}

		const execute: () => Promise<any> = async () => {
			const { headers, body } = buildHeadersAndBody(data, config.headers);
			const fetchFn: typeof fetch = config.customFetch ?? fetch;
			return this.performFetch(fetchFn, fetchUrl, method, headers, body, config);
		};

		if (method === 'GET') {
			const promise = execute().finally(() => {
				this.pendingGets.delete(fetchUrl);
			});
			this.pendingGets.set(fetchUrl, promise);
			const result = await promise;
			if (useCache && result) {
				const now = Date.now();
				for (const [k, v] of this.responseCache) {
					if (v.expiresAt < now) this.responseCache.delete(k);
				}
				this.responseCache.set(fetchUrl, {
					expiresAt: now + ttl,
					data: result.data,
					status: result.status
				});
			}
			return result;
		}

		return execute();
	}

	get(url: string, config?: any) {
		return this.request('GET', url, undefined, config);
	}
	post(url: string, data?: any, config?: any) {
		return this.request('POST', url, data, config);
	}
	put(url: string, data?: any, config?: any) {
		return this.request('PUT', url, data, config);
	}
	patch(url: string, data?: any, config?: any) {
		return this.request('PATCH', url, data, config);
	}
	delete(url: string, config?: any) {
		return this.request('DELETE', url, undefined, config);
	}
}

const api = new ApiClient();
export default api;
