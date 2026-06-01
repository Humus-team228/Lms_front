// src/features/profile/ProfileInfo.tsx
import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { ROLE_LABELS } from '@/shared/types/auth';
import styles from './ProfileInfo.module.css';

export const ProfileInfo: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Личные данные</h2>

            <div className={styles.grid}>
                <div className={styles.field}>
                    <label>ФИО</label>
                    <span className={styles.value}>{user.full_name}</span>
                </div>

                <div className={styles.field}>
                    <label>Email</label>
                    <span className={styles.value}>{user.email}</span>
                </div>

                <div className={styles.field}>
                    <label>Роль в системе</label>
                    {/* 🔹 Отображаем русское название вместо OPERATOR */}
                    <span className={styles.value}>{ROLE_LABELS[user.role]}</span>
                </div>

                <div className={styles.field}>
                    <label>Группа / Подразделение</label>
                    {/* 🔹 Новое поле с номером группы */}
                    <span className={styles.value}>{user.group || 'Не назначена'}</span>
                </div>

                <div className={styles.field}>
                    <label>Табельный номер</label>
                    <span className={styles.value}>{user.id}</span>
                </div>
            </div>

            <div className={styles.note}>
                ℹ️ Для изменения контактных данных или перевода в другую группу обратитесь к администратору или в HR-отдел.
            </div>
        </div>
    );
};