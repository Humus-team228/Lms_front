import React, { useState } from 'react';
import styles from './SecurityConfigWidget.module.css';

export const SecurityConfigWidget: React.FC = () => {
    const [rules, setRules] = useState({
        rlsEnabled: true,
        deptIsolation: true,
        hideSalaries: false,
        auditLogs: true,
        ssoRequired: true,
    });

    const toggle = (key: keyof typeof rules) => {
        setRules(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className={styles.card}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Row-Level Security (RLS)</h3>
                <div className={styles.grid}>
                    <Toggle label="Включить RLS фильтрацию" desc="Данные фильтруются на уровне БД по department_id" active={rules.rlsEnabled} onToggle={() => toggle('rlsEnabled')} />
                    <Toggle label="Изоляция направлений" desc="Тимлиды видят только свою группу, Руководители — своё направление" active={rules.deptIsolation} onToggle={() => toggle('deptIsolation')} />
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Видимость данных</h3>
                <div className={styles.grid}>
                    <Toggle label="Скрывать финансовые данные" desc="Зарплаты и премии скрыты для ролей Оператор/Тимлид" active={rules.hideSalaries} onToggle={() => toggle('hideSalaries')} />
                    <Toggle label="Обязательный SSO" desc="Вход только через корпоративный Active Directory / LDAP" active={rules.ssoRequired} onToggle={() => toggle('ssoRequired')} />
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Аудит и безопасность</h3>
                <div className={styles.grid}>
                    <Toggle label="Логирование действий" desc="Запись всех изменений статусов, комментариев и прав в audit_log" active={rules.auditLogs} onToggle={() => toggle('auditLogs')} />
                </div>
            </div>

            <button className={styles.btnSave}>Применить настройки безопасности</button>
        </div>
    );
};

const Toggle: React.FC<{ label: string; desc: string; active: boolean; onToggle: () => void }> = ({ label, desc, active, onToggle }) => (
    <div className={styles.toggleCard}>
        <div className={styles.toggleHeader}>
            <span className={styles.toggleLabel}>{label}</span>
            <button className={`${styles.switch} ${active ? styles.active : ''}`} onClick={onToggle}>
                <span className={styles.switchDot} />
            </button>
        </div>
        <p className={styles.toggleDesc}>{desc}</p>
    </div>
);