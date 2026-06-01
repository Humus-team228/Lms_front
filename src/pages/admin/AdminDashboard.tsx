// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { UserStatusAction } from '@/features/user-management/UserStatusAction';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import styles from './AdminDashboard.module.css';

const USERS = [
    { id: '1', name: 'Петров П.П.', email: 'petrov@bank.ru', role: 'TEAM_LEADER', status: 'Active' },
    { id: '2', name: 'Иванов И.И.', email: 'ivanov@bank.ru', role: 'OPERATOR', status: 'Suspended' },
];

export default function AdminDashboard() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Администрирование системы</h1>
                    <button className={styles.btnAdd}>+ Добавить пользователя</button>
                </div>

                <div className={styles.card}>
                    <h3>Управление пользователями</h3>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {USERS.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td><UserRoleBadge role={u.role as any} /></td>
                                <td><span className={`${styles.dot} ${u.status === 'Active' ? styles.active : styles.inactive}`} /> {u.status}</td>
                                <td><UserStatusAction userId={u.id} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.card}>
                    <h3>Настройки безопасности (Row-Level Security)</h3>
                    <p className={styles.desc}>Настройка видимости данных между направлениями бизнеса.</p>
                    <div className={styles.mockSetting}>
                        <label>
                            <input type="checkbox" defaultChecked /> Изоляция данных групп (Тимлиды видят только свою группу)
                        </label>
                    </div>
                </div>
            </div>
        </Layout>
    );
}