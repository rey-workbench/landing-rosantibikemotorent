import { io, type Socket } from 'socket.io-client';
import { browser } from '$app/environment';
import { DEFAULTS } from '$lib/constants';

interface WebSocketClientOptions {
	onConnect?: (socketId: string | null) => void;
	onDisconnect?: () => void;
	onConnectError?: (error: Error) => void;
}

class WebSocketClient {
	private socket: Socket | null = null;
	private beforeUnloadHandler: (() => void) | null = null;

	connect(options: WebSocketClientOptions = {}): boolean {
		if (!browser) return false;

		if (this.socket && (this.socket.connected || this.socket.active)) {
			return false;
		}

		if (this.socket) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
			this.socket = null;
		}

		let apiUrl = import.meta.env.VITE_WS_URL;
		if (!apiUrl) {
			if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('api.rosantibikemotorent.com')) {
				apiUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
			} else if (browser) {
				apiUrl = `${window.location.protocol}//${window.location.hostname}:${DEFAULTS.API_FALLBACK_PORT}`;
			} else {
				apiUrl = `http://localhost:${DEFAULTS.API_FALLBACK_PORT}`;
			}
		}

		this.socket = io(`${apiUrl}/realtime`, {
			transports: ['websocket'],
			reconnection: true,
			reconnectionAttempts: DEFAULTS.WS_RECONNECTION_ATTEMPTS,
			reconnectionDelay: DEFAULTS.WS_RECONNECTION_DELAY_MS,
			timeout: DEFAULTS.WS_TIMEOUT_MS,
			autoConnect: true
		});

		this.socket.on('connect', () => {
			options.onConnect?.(this.socket?.id ?? null);
		});
		this.socket.on('disconnect', () => {
			options.onDisconnect?.();
		});
		this.socket.on('connect_error', (error) => {
			options.onConnectError?.(error);
			if (this.socket && !this.socket.connected) {
				this.socket.disconnect();
			}
		});

		if (browser && !this.beforeUnloadHandler) {
			this.beforeUnloadHandler = () => this.disconnect();
			window.addEventListener('beforeunload', this.beforeUnloadHandler);
		}

		return true;
	}

	on(event: string, handler: (...args: any[]) => void): void {
		this.socket?.on(event, handler);
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.removeAllListeners();
			this.socket.disconnect();
			this.socket = null;
		}

		if (browser && this.beforeUnloadHandler) {
			window.removeEventListener('beforeunload', this.beforeUnloadHandler);
			this.beforeUnloadHandler = null;
		}
	}

	isConnected(): boolean {
		return this.socket?.connected ?? false;
	}

	getSocketId(): string | null {
		return this.socket?.id ?? null;
	}
}

export const websocketClient = new WebSocketClient();
