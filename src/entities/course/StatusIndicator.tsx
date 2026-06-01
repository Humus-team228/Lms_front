import React from 'react';
import styles from './StatusIndicator.module.css';

type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'REJECTED';

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
    NOT_STARTED: { label: 'Не начат', color: 'var(--color-gray-400)' },
    IN_PROGRESS: { label: 'В процессе', color: 'var(--color-warning)' },
    REVIEW: { label: 'На проверке', color: 'var(--color-info)' },
    COMPLETED: { label: 'Выполнен', color: 'var(--color-success)' },
    REJECTED: { label: 'На доработке', color: 'var(--color-error)' },
};

export const StatusIndicator: React.FC<{ status: Status }> = ({ status }) => {
    const config = STATUS_CONFIG[status];
    return (
        <div className={styles.container}>
            <span className={styles.dot} style={{ backgroundColor: config.color }} />
            <span className={styles.label}>{config.label}</span>
        </div>
    );
};