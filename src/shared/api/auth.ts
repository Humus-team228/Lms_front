// src/shared/api/auth.ts
import { LoginRequest, LoginResponse } from '@/shared/types/auth';
import { API_CONFIG } from '@/config/api';

export const authService = {
    async login(request: LoginRequest): Promise<LoginResponse> {
        // 🟢 РЕАЛЬНЫЙ ЗАПРОС к Spring Boot
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!response.ok) {
            // Парсим ошибку от бэкенда, если есть
            let errorMsg = 'Неверная почта или пароль';
            try {
                const errorData = await response.json();
                if (errorData.message) errorMsg = errorData.message;
            } catch {
                // Игнорируем, если тело не JSON
            }
            throw new Error(errorMsg);
        }

        return await response.json(); // Вернёт LoginResponse с fullName, role, token, userId
    },
    async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('lms_token')}`,
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось сменить пароль';
            try {
                const err = await res.json();
                errorMsg = err.message || errorMsg;
            } catch {
                // Игнорируем, если тело не JSON
            }
            throw new Error(errorMsg);
        }

        return res.json();
    }
};
