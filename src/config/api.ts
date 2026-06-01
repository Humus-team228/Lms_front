export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://26.150.162.112:8080',
    WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3000',
    TIMEOUT: 10000,
    RETRY_LIMIT: 1,
} as const;