import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/widgets/layout/Layout';
import { useDeptKPIQuery } from '@/shared/hooks/useDeptKPIQuery';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import styles from './GlobalAnalyticsPage.module.css';

export default function GlobalAnalyticsPage() {
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
    const { data: kpi, isLoading, isError } = useDeptKPIQuery();

    // 🔹 Фильтрация по группам
    const filteredGroups = selectedGroup
        ? kpi?.groupBreakdown.filter(g => g.managerId === selectedGroup)
        : kpi?.groupBreakdown || [];

    // 🔹 Агрегированные метрики
    const totalEmployees = kpi?.groupBreakdown.reduce((sum, g) => sum + g.totalEmployees, 0) || 0;
    const totalRedZone = kpi?.groupBreakdown.reduce((sum, g) => sum + g.redZoneUsers.length, 0) || 0;
    const avgCompletion = kpi?.groupBreakdown.length
        ? (kpi.groupBreakdown.reduce((sum, g) => sum + g.completionPercent, 0) / kpi.groupBreakdown.length).toFixed(1)
        : '0';
    const avgScoreOverall = kpi?.groupBreakdown.length
        ? (kpi.groupBreakdown.reduce((sum, g) => sum + g.avgScore, 0) / kpi.groupBreakdown.length).toFixed(1)
        : '0';

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка аналитики направления...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить KPI направления. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                {/* 🔹 Заголовок */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>📊 Глобальная аналитика направления</h1>
                        <p className={styles.subtitle}>
                            Агрегированные KPI и мониторинг эффективности обучения
                        </p>
                    </div>
                </div>

                {/* 🔹 Основные KPI карточки */}
                <div className={styles.kpiGrid}>
                    <div className={styles.kpiCard}>
                        <div className={styles.kpiIcon}>⏱️</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{kpi?.avgOnboardingDays || 0}</span>
                            <span className={styles.kpiLabel}>Среднее время ввода в должность (дней)</span>
                        </div>
                    </div>

                    <div className={styles.kpiCard}>
                        <div className={styles.kpiIcon}>🎯</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{kpi?.firstAttemptPassRate || 0}%</span>
                            <span className={styles.kpiLabel}>Сдача экзамена с 1-й попытки</span>
                        </div>
                    </div>

                    <div className={styles.kpiCard}>
                        <div className={styles.kpiIcon}>👥</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{totalEmployees}</span>
                            <span className={styles.kpiLabel}>Всего сотрудников</span>
                        </div>
                    </div>

                    <div className={`${styles.kpiCard} ${styles.kpiCardWarning}`}>
                        <div className={styles.kpiIcon}>⚠️</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{totalRedZone}</span>
                            <span className={styles.kpiLabel}>В красной зоне</span>
                        </div>
                    </div>

                    <div className={styles.kpiCard}>
                        <div className={styles.kpiIcon}>📈</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{avgCompletion}%</span>
                            <span className={styles.kpiLabel}>Средний % завершения</span>
                        </div>
                    </div>

                    <div className={styles.kpiCard}>
                        <div className={styles.kpiIcon}>⭐</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{avgScoreOverall}</span>
                            <span className={styles.kpiLabel}>Средний балл по направлению</span>
                        </div>
                    </div>

                    <div className={`${styles.kpiCard} ${styles.kpiCardDanger}`}>
                        <div className={styles.kpiIcon}>📉</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{kpi?.totalFired || 0}</span>
                            <span className={styles.kpiLabel}>Уволено сотрудников</span>
                        </div>
                    </div>

                    <div className={styles.kpiCard}>
                        <div className={styles.kpiIcon}>🏆</div>
                        <div className={styles.kpiContent}>
                            <span className={styles.kpiValue}>{kpi?.groupBreakdown.length || 0}</span>
                            <span className={styles.kpiLabel}>Активных групп</span>
                        </div>
                    </div>
                </div>

                {/* 🔹 Фильтр по группам */}
                {kpi && kpi.groupBreakdown.length > 1 && (
                    <div className={styles.filters}>
                        <button
                            className={`${styles.filterBtn} ${!selectedGroup ? styles.active : ''}`}
                            onClick={() => setSelectedGroup(null)}
                        >
                            Все группы ({kpi.groupBreakdown.length})
                        </button>
                        {kpi.groupBreakdown.map(group => (
                            <button
                                key={group.managerId}
                                className={`${styles.filterBtn} ${selectedGroup === group.managerId ? styles.active : ''}`}
                                onClick={() => setSelectedGroup(group.managerId)}
                            >
                                {group.managerName}
                            </button>
                        ))}
                    </div>
                )}

                {/* 🔹 Детализация по группам */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>📋 Детализация по группам</h2>
                        <button
                            className={styles.btnExport}
                            onClick={() => alert('Экспорт отчета в Excel/PDF')}
                        >
                            📥 Экспорт отчета
                        </button>
                    </div>

                    <div className={styles.groupsGrid}>
                        {filteredGroups.map(group => (
                            <div key={group.managerId} className={styles.groupCard}>
                                <div className={styles.groupHeader}>
                                    <div className={styles.groupInfo}>
                                        <h3 className={styles.groupName}>{group.managerName}</h3>
                                        <p className={styles.groupMeta}>
                                            {group.totalEmployees} сотрудников • {group.redZoneUsers.length} в красной зоне
                                        </p>
                                    </div>
                                    <button
                                        className={styles.btnDetails}
                                        onClick={() => navigate(`/head-dept/group/${group.managerId}`)}
                                    >
                                        Подробнее →
                                    </button>
                                </div>

                                {/* 🔹 Прогресс-бар */}
                                <div className={styles.progressSection}>
                                    <div className={styles.progressLabel}>
                                        <span>Завершено заданий</span>
                                        <span className={styles.progressValue}>{group.completionPercent}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${group.completionPercent}%` }}
                                        />
                                    </div>
                                </div>

                                {/* 🔹 Мини-статистика */}
                                <div className={styles.groupStats}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{group.avgScore}</span>
                                        <span className={styles.statLabel}>Ср. балл</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{group.completedAssignments}</span>
                                        <span className={styles.statLabel}>Завершено</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statValue}>{group.totalAssignments}</span>
                                        <span className={styles.statLabel}>Всего заданий</span>
                                    </div>
                                </div>

                                {/* 🔹 Красная зона */}
                                {group.redZoneUsers.length > 0 && (
                                    <div className={styles.redZoneSection}>
                                        <h4 className={styles.redZoneTitle}>
                                            ⚠️ Красная зона ({group.redZoneUsers.length})
                                        </h4>
                                        <div className={styles.redZoneList}>
                                            {group.redZoneUsers.slice(0, 4).map(user => (
                                                <div key={user.id} className={styles.redZoneUser}>
                                                    <UserAvatar name={user.fullName} size="xs" />
                                                    <div className={styles.userInfo}>
                                                        <span className={styles.userName}>{user.fullName}</span>
                                                        <UserRoleBadge role={user.role as any} />
                                                    </div>
                                                </div>
                                            ))}
                                            {group.redZoneUsers.length > 4 && (
                                                <div className={styles.moreUsers}>
                                                    +{group.redZoneUsers.length - 4} ещё
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔹 Пустое состояние */}
                {filteredGroups.length === 0 && (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>📊</div>
                        <h3>Нет данных для отображения</h3>
                        <p>В выбранном фильтре нет групп или сотрудников</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}