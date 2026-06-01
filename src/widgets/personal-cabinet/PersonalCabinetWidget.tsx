import React, { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { ProfileInfo } from '@/features/profile/ProfileInfo';
import { ChangePasswordForm } from '@/features/auth/ChangePasswordForm';
import { NotificationSettings } from '@/features/notifications/NotificationSettings';
import { ActiveSessions } from '@/features/sessions/ActiveSessions';
import styles from './PersonalCabinetWidget.module.css';
import {ROLE_LABELS} from "../../shared/types/auth";

type Tab = 'info' | 'security' | 'notifications' | 'sessions';

const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'info', label: 'Личные данные', icon: '👤' },
    { id: 'security', label: 'Безопасность', icon: '🔐' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔' },
    { id: 'sessions', label: 'Активные сессии', icon: '💻' },
];

export const PersonalCabinetWidget: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('info');
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.userSummary}>
                    <div className={styles.avatar}>{user.full_name.charAt(0)}</div>
                    <div>
                        <div className={styles.name}>{user.full_name}</div>
                        {/* 🔹 Русская роль + группа */}
                        <div className={styles.role}>
                            {ROLE_LABELS[user.role]}{user.group ? ` • ${user.group}` : ''}
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.content}>
                {activeTab === 'info' && <ProfileInfo />}
                {activeTab === 'security' && <ChangePasswordForm />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'sessions' && <ActiveSessions />}
            </main>
        </div>
    );
};