export * from './api';
export * from './motor';
export * from './transaksi';
export * from './blog';

export interface ConnectionState {
    isConnected: boolean;
    socketId: string | null;
}
