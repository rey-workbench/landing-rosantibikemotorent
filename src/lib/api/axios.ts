import axios from 'axios';
import { browser } from '$app/environment';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor (simplified for customer frontend - no auth needed)
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (browser) {
            const message =
                error.response?.data?.message || error.message || 'Terjadi kesalahan sistem';
            console.error('[API Error]', message);
        }
        return Promise.reject(error);
    }
);

export default api;
