import React from 'react';
import styles from './EmployeeStatusSelector.module.css';

type EmployeeStatus = 'ACTIVE' | 'TRAINING' | 'SICK' | 'SUSPENDED';

const STATUS_OPTIONS: Record<EmployeeStatus, { label: string; color: string }> = {
    ACTIVE: { label: 'Активен (В линии)', color: 'var(--color-success)' },
    TRAINING: { label: 'На обучении', color: 'var(--color-warning)' },
    SICK: { label: 'Болен', color: 'var(--color-info)' },
    SUSPENDED: { label: 'Отстранен', color: 'var(--color-error)' },
};

export const EmployeeStatusSelector: React.FC<{
    currentStatus: EmployeeStatus;
    onChange: (status: EmployeeStatus) => void
}> = ({ currentStatus, onChange }) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>Статус сотрудника</label>
            <select
                value={currentStatus}
                onChange={(e) => onChange(e.target.value as EmployeeStatus)}
                className={styles.select}
            >
                {Object.entries(STATUS_OPTIONS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                ))}
            </select>
            <div className={styles.indicator} style={{ borderColor: STATUS_OPTIONS[currentStatus].color }} />
        </div>
    );
};