import { websocketClient } from '$lib/api';
import { browser } from '$app/environment';
import type { UnitMotorUpdate } from '$lib/types';

type UnitMotorUpdateHandler = (data: UnitMotorUpdate) => void;
type TransactionUpdateHandler = (data: any) => void;

class WebSocketService {
	private unitMotorUpdateHandlers = new Set<UnitMotorUpdateHandler>();
	private transactionUpdateHandlers = new Set<TransactionUpdateHandler>();

	connect(): void {
		if (!browser) return;

		const created = websocketClient.connect({
			onConnect: (socketId) => {
				if (import.meta.env.DEV) {
					console.log('[Landing Socket] Connected with ID:', socketId);
				}
			},
			onConnectError: (error) => {
				if (import.meta.env.DEV) {
					console.warn('[Landing Socket] Connection warning:', error.message);
				}
			}
		});

		if (created) {
			this.setupEventListeners();
		}
	}

	disconnect(): void {
		websocketClient.disconnect();
	}

	private setupEventListeners(): void {
		websocketClient.on('unit-motor:update', (data: UnitMotorUpdate) => {
			this.unitMotorUpdateHandlers.forEach((handler) => handler(data));
		});

		const transactionEvents = [
			'transaksi-created',
			'transaksi-updated',
			'transaksi-deleted',
			'transaksi-selesai'
		];

		transactionEvents.forEach((event) => {
			websocketClient.on(event, (data) => {
				this.transactionUpdateHandlers.forEach((handler) => handler({ event, data }));
			});
		});
	}

	onUnitMotorUpdate(handler: UnitMotorUpdateHandler) {
		this.unitMotorUpdateHandlers.add(handler);
		return () => this.unitMotorUpdateHandlers.delete(handler);
	}

	onTransactionUpdate(handler: TransactionUpdateHandler) {
		this.transactionUpdateHandlers.add(handler);
		return () => this.transactionUpdateHandlers.delete(handler);
	}
}

export const websocketService = new WebSocketService();
