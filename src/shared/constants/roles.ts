// src/shared/constants/roles.ts

export const ROLES = {
    OPERATOR: 'OPERATOR',
    TEAM_LEADER: 'TEAM_LEADER',
    HEAD_DEPT: 'HEAD_DEPT',
    ADMIN: 'ADMIN',
} as const;

// Тип Role — это объединение всех возможных строковых значений
export type Role = typeof ROLES[keyof typeof ROLES];

// Массив всех ролей для удобства
export const ALL_ROLES = Object.values(ROLES);