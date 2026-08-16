import { browser } from '$app/environment';

let rawUrl = import.meta.env.VITE_API_URL;
if (!rawUrl) {
	if (browser) {
		rawUrl = `${window.location.protocol}//${window.location.hostname}:3030/api`;
	} else {
		rawUrl = 'http://localhost:3030/api';
	}
}
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

function buildUrl(url: string, params?: any): string {
	let fetchUrl = `${API_BASE_URL}${url}`;
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

	let body = undefined;
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
		const maxAttempts = method === 'GET' ? 2 : 1;
		while (attempts < maxAttempts) {
			attempts++;
			try {
				return await this.performFetchOnce(fetchFn, fetchUrl, method, headers, body, config);
			} catch (error: any) {
				this.handleFetchError(error, attempts, maxAttempts);
				// Small delay before retry for GET requests
				await new Promise((resolve) => setTimeout(resolve, 300));
			}
		}
	}

	async request(method: string, url: string, data?: any, config: any = {}) {
		const fetchUrl = buildUrl(url, config.params);

		// Deduplicate in-flight GET requests to the same URL
		if (method === 'GET' && !config.customFetch) {
			if (this.pendingGets.has(fetchUrl)) {
				return this.pendingGets.get(fetchUrl);
			}
		}

		const execute = async () => {
			const { headers, body } = buildHeadersAndBody(data, config.headers);
			const fetchFn: typeof fetch = config.customFetch ?? fetch;
			return this.performFetch(fetchFn, fetchUrl, method, headers, body, config);
		};

		if (method === 'GET' && !config.customFetch) {
			const promise = execute().finally(() => {
				this.pendingGets.delete(fetchUrl);
			});
			this.pendingGets.set(fetchUrl, promise);
			return promise;
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
