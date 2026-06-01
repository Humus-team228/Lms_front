import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import { useAuth } from '@/app/providers/AuthProvider';
import { ChangePasswordForm } from '@/features/auth/ChangePasswordForm';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <Layout>
            <div className={styles.container}>
                {/* Карточка профиля */}
                <div className={styles.card}>
                    <div className={styles.profileHeader}>
                        <UserAvatar name={user?.full_name || 'User'} size="lg" />
                        <div className={styles.info}>
                            <h1 className={styles.name}>{user?.full_name}</h1>
                            <div className={styles.meta}>
                                <UserRoleBadge role={user?.role || 'OPERATOR'} />
                                <span className={styles.email}>{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.details}>
                        <h3 className={styles.sectionTitle}>Личные данные</h3>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label>Табельный номер</label>
                                <span>{user?.id || 'N/A'}</span>
                            </div>
                            <div className={styles.field}>
                                <label>Дата найма</label>
                                <span>12.04.2025</span>
                            </div>
                            <div className={styles.field}>
                                <label>Группа</label>
                                <span>КЦ-Розница (Группа А)</span>
                            </div>
                            <div className={styles.field}>
                                <label>Статус</label>
                                <span className={styles.statusActive}>● Активен</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Карточка смены пароля */}
                <div className={styles.card}>
                    <ChangePasswordForm />
                </div>
            </div>
        </Layout>
    );
}