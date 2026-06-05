import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { useTurnoverAnalytics } from '@/shared/hooks/useTurnoverAnalytics';
import { UserAvatar } from '@/entities/user/UserAvatar';
import styles from './TurnoverAnalysisPage.module.css';

export default function TurnoverAnalyticsPage() {
    const { data: analytics, isLoading, isError } = useTurnoverAnalytics();

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка аналитики текучести...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить данные. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>📉 Аналитика текучести кадров</h1>
                        <p className={styles.subtitle}>
                            Мониторинг увольнений и анализ причин оттока сотрудников
                        </p>
                    </div>
                </div>

                {/* 🔹 Основные метрики */}
                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>👥</div>
                        <div className={styles.metricContent}>
                            <span className={styles.metricValue}>{analytics?.totalEmployees || 0}</span>
                            <span className={styles.metricLabel}>Всего сотрудников</span>
                        </div>
                    </div>

                    <div className={`${styles.metricCard} ${styles.metricCardDanger}`}>
                        <div className={styles.metricIcon}>📉</div>
                        <div className={styles.metricContent}>
                            <span className={styles.metricValue}>{analytics?.firedEmployees || 0}</span>
                            <span className={styles.metricLabel}>Уволено сотрудников</span>
                        </div>
                    </div>

                    <div className={`${styles.metricCard} ${analytics && analytics.turnoverRate > 15 ? styles.metricCardWarning : ''}`}>
                        <div className={styles.metricIcon}>📊</div>
                        <div className={styles.metricContent}>
                            <span className={styles.metricValue}>{analytics?.turnoverRate.toFixed(1) || 0}%</span>
                            <span className={styles.metricLabel}>Коэффициент текучести</span>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>⏱️</div>
                        <div className={styles.metricContent}>
                            <span className={styles.metricValue}>{analytics?.avgTenureDays || 0}</span>
                            <span className={styles.metricLabel}>Средний срок работы (дней)</span>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>🎉</div>
                        <div className={styles.metricContent}>
                            <span className={styles.metricValue}>{analytics?.newHiresLastMonth || 0}</span>
                            <span className={styles.metricLabel}>Новых сотрудников (мес)</span>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}>✅</div>
                        <div className={styles.metricContent}>
                            <span className={styles.metricValue}>{analytics?.activeEmployees || 0}</span>
                            <span className={styles.metricLabel}>Активных сотрудников</span>
                        </div>
                    </div>
                </div>

                {/* 🔹 Увольнения по этапам обучения */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}> Увольнения по этапам обучения</h2>
                    <div className={styles.stagesChart}>
                        {analytics?.firedByStage.map((item, index) => (
                            <div key={index} className={styles.stageBar}>
                                <div className={styles.stageLabel}>
                                    <span className={styles.stageName}>{item.stage}</span>
                                    <span className={styles.stageCount}>{item.count} чел. ({item.percentage}%)</span>
                                </div>
                                <div className={styles.stageProgress}>
                                    <div
                                        className={styles.stageFill}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔹 Текучесть по группам */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>📊 Текучесть по группам</h2>
                    <div className={styles.groupsTable}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Руководитель группы</th>
                                <th>Всего сотрудников</th>
                                <th>Уволено</th>
                                <th>Коэффициент текучести</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {analytics?.turnoverByGroup.map((group, index) => (
                                <tr key={index} className={group.rate > 20 ? styles.highTurnover : ''}>
                                    <td className={styles.managerName}>{group.managerName}</td>
                                    <td>{group.total}</td>
                                    <td>{group.fired}</td>
                                    <td>
                                        <div className={styles.rateCell}>
                                            <div className={styles.rateBar}>
                                                <div
                                                    className={`${styles.rateFill} ${group.rate > 20 ? styles.rateHigh : styles.rateNormal}`}
                                                    style={{ width: `${Math.min(group.rate, 100)}%` }}
                                                />
                                            </div>
                                            <span className={styles.rateValue}>{group.rate.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td>
                      <span className={`${styles.badge} ${group.rate > 20 ? styles.badgeDanger : group.rate > 10 ? styles.badgeWarning : styles.badgeSuccess}`}>
                        {group.rate > 20 ? 'Критично' : group.rate > 10 ? 'Внимание' : 'Норма'}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🔹 Последние увольнения */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}> Последние увольнения</h2>
                    <div className={styles.recentList}>
                        {analytics?.recentTurnover.map((employee) => (
                            <div key={employee.id} className={styles.employeeCard}>
                                <div className={styles.employeeInfo}>
                                    <UserAvatar name={employee.fullName} size="md" />
                                    <div>
                                        <div className={styles.employeeName}>{employee.fullName}</div>
                                        <div className={styles.employeeMeta}>
                                            <span>{employee.roleName}</span>
                                            <span>•</span>
                                            <span>{employee.managerName || 'Без руководителя'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.employeeDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Дата найма:</span>
                                        <span className={styles.detailValue}>
                      {new Date(employee.hireDate).toLocaleDateString('ru-RU')}
                    </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Статус:</span>
                                        <span className={`${styles.statusBadge} ${styles.statusFired}`}>
                      {employee.statusName || 'Уволен'}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}