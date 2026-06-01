// src/widgets/team-dashboard/RiskZoneWidget.tsx
import React from 'react';
import styles from './RiskZoneWidget.module.css';

const AT_RISK_EMPLOYEES = [
    { id: 1, name: 'Сидоров Дмитрий', stage: 'Настройка CRM', daysLate: 3, risk: 'High' },
    { id: 2, name: 'Новиков Андрей', stage: 'Скрипты продаж', daysLate: 5, risk: 'Critical' },
];

export const RiskZoneWidget: React.FC = () => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>⚠️ Красная зона (Отстающие)</h3>
                <span className={styles.count}>2 сотрудника</span>
            </div>
            <div className={styles.list}>
                {AT_RISK_EMPLOYEES.map((emp) => (
                    <div key={emp.id} className={`${styles.row} ${emp.risk === 'Critical' ? styles.critical : styles.warning}`}>
                        <div className={styles.info}>
                            <span className={styles.name}>{emp.name}</span>
                            <span className={styles.stage}>Застрял на: {emp.stage}</span>
                        </div>
                        <div className={styles.meta}>
                            <span className={styles.days}>+{emp.daysLate} дней</span>
                            <button className={styles.btn}>Вмешаться</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};