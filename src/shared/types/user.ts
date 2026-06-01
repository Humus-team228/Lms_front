// src/shared/types/user.ts
import { ROLES, type Role } from '@/shared/constants/roles';

// 🔹 DTO ответа от GET /api/users
export interface UserDTO {
    id: number;
    fullName: string;
    email: string;
    roleCode: string;
    roleName: string;
    managerId: number | null;
    managerName: string | null;
    statusCode: string;
    statusName: string;
    statusId: number;
    hireDate: string;
    activeFlag: boolean;
}

// 🔹 UI-тип для отображения в таблице
export interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
    roleName: string;
    managerName: string | null;
    status: string;
    statusName: string;
    hireDate: string;
    isActive: boolean;
}

// 🔹 Маппинг DTO → UI
export function mapUserDTO(dto: UserDTO): User {
    // 🔹 Маппинг roleCode → Role
    const roleMap: Record<string, Role> = {
        'OPERATOR': ROLES.OPERATOR,
        'GROUP_LEADER': ROLES.TEAM_LEADER,
        'TEAM_LEADER': ROLES.TEAM_LEADER,
        'HEAD_DEPT': ROLES.HEAD_DEPT,
        'ADMIN': ROLES.ADMIN,
    };

    return {
        id: dto.id,
        fullName: dto.fullName || '',
        email: dto.email || '',
        role: roleMap[dto.roleCode] || ROLES.OPERATOR, // 🔹 Конвертируем
        roleName: dto.roleName || '',
        managerName: dto.managerName || null,
        status: dto.statusCode || '',
        statusName: dto.statusName || '',
        hireDate: dto.hireDate || '',
        isActive: dto.activeFlag ?? true,
    };
}

// 🔹 DTO для создания/обновления пользователя
export interface CreateUserRequest {
    fullName: string;
    email: string;
    roleId: number;
    managerId?: number | null;
    statusCode: string;
    hireDate: string;
    password: string;
}

export interface UpdateUserRequest {
    fullName?: string;
    email?: string;
    roleId?: number;
    managerId?: number | null;
    statusCode?: string;
    hireDate?: string;
}