import React from 'react';
import styles from './ActiveSessions.module.css';

const MOCK_SESSIONS = [
    { id: 1, device: 'Chrome / Windows', ip: '192.168.1.10', lastActive: 'Только что', current: true },
    { id: 2, device: 'Safari / iPhone', ip: '10.0.0.5', lastActive: '2 часа назад', current: false },
];

export const ActiveSessions: React.FC = () => (
    <div className={styles.container}>
        <h2 className={styles.title}>Активные сессии</h2>
        <div className={styles.list}>
            {MOCK_SESSIONS.map(s => (
                <div key={s.id} className={styles.item}>
                    <div className={styles.info}>
                        <span className={styles.device}>{s.device} {s.current && <span className={styles.badge}>Текущая</span>}</span>
                        <span className={styles.meta}>IP: {s.ip} • Активность: {s.lastActive}</span>
                    </div>
                    {!s.current && <button className={styles.revokeBtn}>Завершить</button>}
                </div>
            ))}
        </div>
        <button className={styles.revokeAllBtn} onClick={() => alert('Все остальные сессии завершены')}>
            🛑 Завершить все другие сессии
        </button>
    </div>
);