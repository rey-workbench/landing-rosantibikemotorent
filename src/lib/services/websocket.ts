import { browser } from '$app/environment';
import { websocketClient } from '$lib/api';
import type { UnitMotorUpdate } from '$lib/types';

const WS_CHANNELS = {
	UNIT_MOTOR_UPDATE: 'unit-motor:update'
} as const;

type UnitMotorUpdateHandler = (data: UnitMotorUpdate) => void;

class WebSocketService {
	private unitMotorUpdateHandlers = new Set<UnitMotorUpdateHandler>();

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
	}

	onUnitMotorUpdate(handler: UnitMotorUpdateHandler) {
		this.unitMotorUpdateHandlers.add(handler);
		return () => this.unitMotorUpdateHandlers.delete(handler);
	}
}

export const websocketService = new WebSocketService();
