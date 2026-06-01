import React from 'react';
import styles from './KPIGrid.module.css';

export interface KPIItem {
    id: string;
    label: string;
    value: string | number;
    icon: string;
    trend?: {
        direction: 'up' | 'down';
        value: string;
        isPositive: boolean; // true если рост хорош (например, баллы), false если рост плох (текучка)
    };
}

interface KPIGridProps {
    department: string;
    period: { from: string; to: string };
}

// В реальном проекте данные придут через React Query с staleTime: 3600000 (1 час)
// согласно п. 2.2 Нефункциональные требования
const MOCK_KPIS: KPIItem[] = [
    {
        id: 'onboarding_time',
        label: 'Ср. время ввода в должность',
        value: '18 дней',
        icon: '⏱️',
        trend: { direction: 'down', value: '-2 дн.', isPositive: true }
    },
    {
        id: 'exam_pass_rate',
        label: 'Сдача экзамена с 1-й попытки',
        value: '87%',
        icon: '🎓',
        trend: { direction: 'up', value: '+5%', isPositive: true }
    },
    {
        id: 'turnover_rate',
        label: 'Текучесть кадров (3 мес.)',
        value: '12%',
        icon: '📉',
        trend: { direction: 'up', value: '+1%', isPositive: false } // рост текучки = плохо
    },
    {
        id: 'avg_score',
        label: 'Средний балл аттестаций',
        value: '4.6 / 5',
        icon: '⭐',
        trend: { direction: 'up', value: '+0.3', isPositive: true }
    }
];

export const KPIGrid: React.FC<KPIGridProps> = ({ department, period }) => {
    // В будущем здесь будет useQuery({ queryKey: ['kpi', department, period], staleTime: 3600000 })

    return (
        <div className={styles.grid}>
            {MOCK_KPIS.map((kpi) => {
                const trendClass = kpi.trend
                    ? kpi.trend.direction === 'up'
                        ? kpi.trend.isPositive ? styles.good : styles.bad
                        : kpi.trend.isPositive ? styles.bad : styles.good
                    : styles.neutral;

                return (
                    <div key={kpi.id} className={styles.card}>
                        <div className={styles.header}>
                            <span className={styles.icon}>{kpi.icon}</span>
                            <span className={styles.label}>{kpi.label}</span>
                        </div>

                        <div className={styles.value}>{kpi.value}</div>

                        {kpi.trend && (
                            <div className={`${styles.trend} ${trendClass}`}>
                <span className={styles.arrow}>
                  {kpi.trend.direction === 'up' ? '↑' : '↓'}
                </span>
                                <span>{kpi.trend.value}</span>
                                <span className={styles.trendLabel}>к прошлому периоду</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};