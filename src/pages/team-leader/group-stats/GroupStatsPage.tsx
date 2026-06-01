import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { useGroupStatsQuery } from '@/shared/hooks/useGroupStatsQuery';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import styles from './GroupStatsPage.module.css';

export default function GroupStatsPage() {
    const { data: stats, isLoading, isError } = useGroupStatsQuery();

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка статистики группы...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить статистику группы. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Статистика группы</h1>
                    <p className={styles.subtitle}>
                        {stats?.managerName || 'Моя команда'} • KPI и результаты обучения
                    </p>
                </div>

                {/* 🔹 KPI Карточки */}
                <div className={styles.kpiGrid}>
                    <div className={styles.kpiCard}>
                        <span className={styles.kpiValue}>{stats?.totalEmployees || 0}</span>
                        <span className={styles.kpiLabel}>Всего сотрудников</span>
                    </div>
                    <div className={styles.kpiCard}>
                        <span className={styles.kpiValue}>{stats?.completionPercent?.toFixed(1) || 0}%</span>
                        <span className={styles.kpiLabel}>Завершено заданий</span>
                        <span className={styles.kpiSubtext}>
              {stats?.completedAssignments || 0} из {stats?.totalAssignments || 0}
            </span>
                    </div>
                    <div className={styles.kpiCard}>
                        <span className={styles.kpiValue}>{stats?.avgScore?.toFixed(1) || 0}</span>
                        <span className={styles.kpiLabel}>Средний балл</span>
                    </div>
                    <div className={`${styles.kpiCard} ${styles.redZoneCard}`}>
                        <span className={styles.kpiValue}>{stats?.redZoneUsers?.length || 0}</span>
                        <span className={styles.kpiLabel}>В красной зоне</span>
                        <span className={styles.kpiSubtext}>Отстают от графика</span>
                    </div>
                </div>

                {/* 🔹 Красная зона */}
                {stats?.redZoneUsers && stats.redZoneUsers.length > 0 && (
                    <div className={styles.redZoneSection}>
                        <h2 className={styles.sectionTitle}>⚠️ Красная зона — требуют внимания</h2>
                        <div className={styles.redZoneGrid}>
                            {stats.redZoneUsers.map(user => (
                                <div key={user.id} className={styles.redZoneCardItem}>
                                    <div className={styles.redZoneHeader}>
                                        <UserAvatar name={user.fullName} size="md" />
                                        <div>
                                            <div className={styles.redZoneName}>{user.fullName}</div>
                                            <div className={styles.redZoneEmail}>{user.email}</div>
                                        </div>
                                    </div>
                                    <div className={styles.redZoneActions}>
                                        <UserRoleBadge role={user.role as any} />
                                        <button className={styles.btnView}>Просмотреть</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}