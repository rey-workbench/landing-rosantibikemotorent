import { browser } from '$app/environment';
import { websocketClient } from '$lib/api';
import type { UnitMotorUpdate } from '$lib/types';

const WS_CHANNELS = {
	UNIT_MOTOR_UPDATE: 'unit-motor:update',
	TRANSAKSI_CREATED: 'transaksi:created',
	TRANSAKSI_UPDATED: 'transaksi:updated',
	TRANSAKSI_DELETED: 'transaksi:deleted',
	TRANSAKSI_SELESAI: 'transaksi:selesai'
} as const;

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
		websocketClient.on(WS_CHANNELS.UNIT_MOTOR_UPDATE, (data: UnitMotorUpdate) => {
			for (const handler of this.unitMotorUpdateHandlers) {
				handler(data);
			}
		});

		const transactionEvents = [
			WS_CHANNELS.TRANSAKSI_CREATED,
			WS_CHANNELS.TRANSAKSI_UPDATED,
			WS_CHANNELS.TRANSAKSI_DELETED,
			WS_CHANNELS.TRANSAKSI_SELESAI
		];

		transactionEvents.forEach((event) => {
			websocketClient.on(event, (data) => {
				for (const handler of this.transactionUpdateHandlers) {
					handler({ event, data });
				}
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
