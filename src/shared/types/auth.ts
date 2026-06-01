// src/shared/types/auth.ts
import { ROLES, type Role } from '@/shared/constants/roles';

export interface LoginRequest {
    email: string;
    password: string;
}

// 🔹 Ответ от Spring Boot (camelCase, userId как number)
export interface LoginResponse {
    fullName: string;      // вместо full_name
    role: string;          // "ADMIN", "OPERATOR" и т.д.
    token: string;
    userId: number;
    group?: string;
}

export const ROLE_LABELS: Record<Role, string> = {
    [ROLES.OPERATOR]: 'Оператор',
    [ROLES.TEAM_LEADER]: 'Руководитель группы',
    [ROLES.HEAD_DEPT]: 'Руководитель направления',
    [ROLES.ADMIN]: 'Администратор',
};

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}

// 🔹 Внутренний тип пользователя для фронтенда (после маппинга)
export interface AppUser {
    group: any;
    id: string;
    full_name: string;
    email: string;
    role: Role;
}

// 🔹 Функция маппинга: Backend DTO → Frontend AppUser
export function mapLoginResponseToUser(response: LoginResponse, email: string): AppUser {
    const roleMap: Record<string, Role> = {
        'ADMIN': ROLES.ADMIN,
        'GROUP_LEADER': ROLES.TEAM_LEADER,
        'TEAM_LEADER': ROLES.TEAM_LEADER,
        'DEPARTMENT_LEADER': ROLES.HEAD_DEPT,
        'HEAD_DEPT': ROLES.HEAD_DEPT,
        'OPERATOR': ROLES.OPERATOR,
    };

    return {
        id: String(response.userId),
        full_name: response.fullName,
        email: email,
        role: roleMap[response.role] || ROLES.OPERATOR,
        group: response.group,
    };
}