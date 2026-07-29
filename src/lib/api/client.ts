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

			let attempts = 0;
			const maxAttempts = method === 'GET' ? 2 : 1;

			while (attempts < maxAttempts) {
				attempts++;
				try {
					const response = await fetchFn(fetchUrl, {
						method,
						headers,
						body,
						signal: config.signal
					});
					return await parseResponse(response);
				} catch (error: any) {
					if (error.name === 'AbortError') throw error;
					if (attempts >= maxAttempts) {
						if (browser) {
							console.error(
								'[API Error]',
								error.response?.status ?? 'network error'
							);
						}
						throw error;
					}
					// Small delay before retry for GET requests
					await new Promise((resolve) => setTimeout(resolve, 300));
				}
			}
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

export const api = new ApiClient();
export default api;
