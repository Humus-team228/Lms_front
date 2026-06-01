import React from 'react';
import styles from './TurnoverChart.module.css';

interface ChurnData { stage: string; churnRate: number; avgDays: number; }

export const TurnoverChart: React.FC<{ data: ChurnData[] }> = ({ data }) => (
    <div className={styles.card}>
        <h3 className={styles.title}>Текучесть по этапам (%)</h3>
        <div className={styles.chart}>
            {data.map(item => (
                <div key={item.stage} className={styles.row}>
                    <span className={styles.stage}>{item.stage}</span>
                    <div className={styles.barWrapper}>
                        <div className={styles.bar} style={{ width: `${item.churnRate * 5}%`, backgroundColor: item.churnRate > 15 ? 'var(--color-error)' : item.churnRate > 10 ? 'var(--color-warning)' : 'var(--color-success)' }} />
                    </div>
                    <span className={styles.rate}>{item.churnRate}%</span>
                    <span className={styles.days}> {item.avgDays} дн.</span>
                </div>
            ))}
        </div>
    </div>
);