// src/shared/api/user.ts
import { UserDTO, CreateUserRequest, UpdateUserRequest } from '@/shared/types/user';
import { API_CONFIG } from '@/config/api';

const getHeaders = () => {
    const token = localStorage.getItem('lms_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const userService = {
    // 🔹 Получить всех пользователей
    async getUsers(): Promise<UserDTO[]> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users`, {
            method: 'GET',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось загрузить пользователей`);
        }

        return res.json();
    },

    // 🔹 Создать пользователя
    async createUser(request: CreateUserRequest): Promise<UserDTO> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось создать пользователя';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    // 🔹 Обновить пользователя
    async updateUser(userId: number, request: UpdateUserRequest): Promise<UserDTO> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось обновить пользователя';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    // 🔹 Заблокировать пользователя
    async blockUser(userId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}/block`, {
            method: 'PATCH',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось заблокировать пользователя`);
        }
    },

    // 🔹 Разблокировать пользователя
    async unblockUser(userId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}/unblock`, {
            method: 'PATCH',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось разблокировать пользователя`);
        }
    },
    async updateUserStatus(userId: number, statusId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}/status`, {
            method: 'PATCH',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ statusId }),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось изменить статус';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
    },

    // 🔹 Мягкое удаление / деактивация (DELETE /api/users/{id})
    async deleteUser(userId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось деактивировать пользователя';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
    },

    async getTeamMembers(managerId: number): Promise<UserDTO[]> {
        const res = await fetch(
            `${API_CONFIG.BASE_URL}/api/users/by-manager/${managerId}`,
            {
                method: 'GET',
                headers: getHeaders(),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось загрузить команду`);
        }

        return res.json();
    },
};