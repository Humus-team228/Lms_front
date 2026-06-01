// src/widgets/analytics-report/TurnoverWidget.tsx
import React from 'react';
import styles from './TurnoverWidget.module.css';

// Данные: На каком этапе чаще всего увольняются
const CHURN_DATA = [
    { stage: 'Вводный курс', count: 12, percent: 30 },
    { stage: 'Стажировка с наставником', count: 8, percent: 20 },
    { stage: 'Финальный экзамен', count: 2, percent: 5 },
];

export const TurnoverWidget: React.FC = () => {
    return (
        <div className={styles.card}>
            <h3>📉 Анализ текучести по этапам</h3>
            <p className={styles.subtitle}>Где сотрудники покидают банк?</p>
            <div className={styles.chart}>
                {CHURN_DATA.map((item) => (
                    <div key={item.stage} className={styles.barContainer}>
                        <div className={styles.label}>{item.stage}</div>
                        <div className={styles.barWrapper}>
                            <div className={styles.bar} style={{ width: `${item.percent}%`, backgroundColor: item.percent > 20 ? 'var(--color-error)' : 'var(--color-warning)' }} />
                        </div>
                        <div className={styles.value}>{item.count} чел.</div>
                    </div>
                ))}
            </div>
        </div>
    );
};