import React from 'react';
import styles from './DateRangePicker.module.css';

interface DateRange {
    from: string;
    to: string;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (value: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    const handleChange = (field: 'from' | 'to', e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, [field]: e.target.value });
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>Период</label>
            <div className={styles.inputs}>
                <input
                    type="date"
                    value={value.from}
                    onChange={(e) => handleChange('from', e)}
                    className={styles.input}
                />
                <span className={styles.separator}>—</span>
                <input
                    type="date"
                    value={value.to}
                    onChange={(e) => handleChange('to', e)}
                    className={styles.input}
                />
            </div>
        </div>
    );
};