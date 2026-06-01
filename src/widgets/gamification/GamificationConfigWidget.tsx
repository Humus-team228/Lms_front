import React, { useState } from 'react';
import styles from './GamificationConfigWidget.module.css';

export const GamificationConfigWidget: React.FC = () => {
    const [weights, setWeights] = useState({ course: 10, task: 5, exam: 20, streak: 2 });
    const [levels, setLevels] = useState([
        { name: 'Новичок', minPoints: 0, reward: 'Бейдж' },
        { name: 'Специалист', minPoints: 100, reward: 'Премия 5%' },
        { name: 'Эксперт', minPoints: 300, reward: 'Доп. выходной' },
    ]);

    const handleWeightChange = (key: string, val: number) => setWeights(p => ({ ...p, [key]: val }));

    return (
        <div className={styles.card}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>⚖️ Веса баллов за действия</h3>
                <div className={styles.grid}>
                    {Object.entries(weights).map(([key, val]) => (
                        <div key={key} className={styles.field}>
                            <label>{key === 'course' ? 'Пройден курс' : key === 'task' ? 'Выполнена задача' : key === 'exam' ? 'Сдан экзамен' : 'Серия дней'}</label>
                            <input type="number" value={val} onChange={e => handleWeightChange(key, Number(e.target.value))} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🏆 Уровни и награды</h3>
                <table className={styles.table}>
                    <thead><tr><th>Уровень</th><th>Мин. баллов</th><th>Награда</th></tr></thead>
                    <tbody>
                    {levels.map((l, i) => (
                        <tr key={i}>
                            <td><input defaultValue={l.name} className={styles.inputSmall} /></td>
                            <td><input type="number" defaultValue={l.minPoints} className={styles.inputSmall} /></td>
                            <td><input defaultValue={l.reward} className={styles.inputSmall} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button className={styles.btnSave}> Сохранить конфигурацию</button>
        </div>
    );
};