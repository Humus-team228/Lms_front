import React from 'react';
import { Role } from '@/shared/constants/roles';
import styles from './UserRoleBadge.module.css';

const ROLE_NAMES: Record<Role, string> = {
    OPERATOR: 'Оператор',
    TEAM_LEADER: 'Тимлид',
    HEAD_DEPT: 'Руководитель',
    ADMIN: 'Администратор'
};

export const UserRoleBadge: React.FC<{ role: Role }> = ({ role }) => (
    <span className={styles.badge}>{ROLE_NAMES[role]}</span>
);