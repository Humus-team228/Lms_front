import React from 'react';
import styles from './DepartmentSelect.module.css';

interface DepartmentSelectProps {
    value: string;
    onChange: (value: string) => void;
}

// В реальности этот список подтянется из справочника APP_DICTIONARY (category_code = 'DEPARTMENT')
const DEPARTMENTS = [
    { id: 'all', name: 'Все направления' },
    { id: 'retail', name: 'Розничный бизнес' },
    { id: 'corporate', name: 'Корпоративный бизнес' },
    { id: 'cards', name: 'Карты и платежи' },
];

export const DepartmentSelect: React.FC<DepartmentSelectProps> = ({ value, onChange }) => (
    <div className={styles.container}>
        <label className={styles.label}>Направление</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.select}
        >
            {DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
        </select>
    </div>
);