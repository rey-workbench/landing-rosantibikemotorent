import { io, type Socket } from 'socket.io-client';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { MotorStatusUpdate, UnitMotorUpdate, ConnectionState } from '$lib/types';

export const socketConnected = writable<boolean>(false);
export const motorAvailability = writable<MotorStatusUpdate | null>(null);

type MotorStatusUpdateHandler = (data: MotorStatusUpdate) => void;
type UnitMotorUpdateHandler = (data: UnitMotorUpdate) => void;

class WebSocketService {
    private socket: Socket | null = null;
    private connectionState = writable<ConnectionState>({
        isConnected: false,
        socketId: null
    });
    private isInitialized = false;
    private beforeUnloadHandler: (() => void) | null = null;

    private motorStatusUpdateHandlers = new Set<MotorStatusUpdateHandler>();
    private unitMotorUpdateHandlers = new Set<UnitMotorUpdateHandler>();

    connect(): void {
        if (!browser) {
            return;
        }

        if (this.socket && (this.socket.connected || this.socket.active)) {
            return;
        }

        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }

        let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3030/api';
        apiUrl = apiUrl.replace(/\/api$/, '').replace(/\/api$/, '');
        
        alert('WS URL: ' + apiUrl);

        this.socket = io(`${apiUrl}/realtime`, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            autoConnect: true,
        });

        this.setupEventListeners();
        this.isInitialized = true;

        if (browser && !this.beforeUnloadHandler) {
            this.beforeUnloadHandler = () => this.disconnect();
            window.addEventListener('beforeunload', this.beforeUnloadHandler);
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
            this.isInitialized = false;
            this.updateState(false, null);
        }

        if (browser && this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = null;
        }
    }

    private updateState(isConnected: boolean, socketId: string | null) {
        socketConnected.set(isConnected);
        this.connectionState.update(() => ({
            isConnected,
            socketId
        }));
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.updateState(true, this.socket?.id || null);
        });

        this.socket.on('disconnect', () => {
            this.updateState(false, null);
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Landing Socket] Connection error:', error.message);
        });

        this.socket.on('motor-status-update', (data: MotorStatusUpdate) => {
            motorAvailability.set(data);
            this.motorStatusUpdateHandlers.forEach(handler => handler(data));
        });

        this.socket.on('unit-motor:update', (data: UnitMotorUpdate) => {
            this.unitMotorUpdateHandlers.forEach(handler => handler(data));
        });
    }

    onMotorStatusUpdate(handler: MotorStatusUpdateHandler) {
        this.motorStatusUpdateHandlers.add(handler);
        return () => this.motorStatusUpdateHandlers.delete(handler);
    }

    onUnitMotorUpdate(handler: UnitMotorUpdateHandler) {
        this.unitMotorUpdateHandlers.add(handler);
        return () => this.unitMotorUpdateHandlers.delete(handler);
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    getSocketId(): string | null {
        return this.socket?.id ?? null;
    }

    getConnectionState() {
        return this.connectionState;
    }
}

export const websocketService = new WebSocketService();
export default websocketService;
