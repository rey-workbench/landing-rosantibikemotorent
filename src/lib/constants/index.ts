export const STATUS_MOTOR = {
    TERSEDIA: 'TERSEDIA',
    DISEWA: 'DISEWA',
    PERBAIKAN: 'PERBAIKAN',
    DIPESAN: 'DIPESAN',
    OVERDUE: 'OVERDUE',
} as const;

export const STATUS_TRANSAKSI = {
    PENDING: 'PENDING',
    AKTIF: 'AKTIF',
    SELESAI: 'SELESAI',
    OVERDUE: 'OVERDUE',
    DIBATALKAN: 'DIBATALKAN',
} as const;

export const API_ENDPOINTS = {
    JENIS_MOTOR: '/jenis-motor',
    UNIT_MOTOR: '/unit-motor',
    TRANSAKSI: '/transaksi',
    BLOG: '/blog',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

export const WEBSOCKET_URL = {
    REALTIME: '/realtime',
} as const;
