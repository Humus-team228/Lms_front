import React from 'react';
import styles from './LeaderboardWidget.module.css';

const MOCK_LEADERS = [
    { rank: 1, name: 'Анна К.', points: 1250, avatar: 'АК' },
    { rank: 2, name: 'Иван П.', points: 1180, avatar: 'ИП' },
    { rank: 3, name: 'Вы', points: 980, avatar: 'ВЫ', isMe: true },
];

export const LeaderboardWidget: React.FC = () => (
    <div className={styles.widget}>
        <h3 className={styles.title}>🏆 Топ группы</h3>
        <div className={styles.list}>
            {MOCK_LEADERS.map(p => (
                <div key={p.rank} className={`${styles.row} ${p.isMe ? styles.me : ''}`}>
                    <span className={styles.rank}>{p.rank}</span>
                    <span className={styles.avatar}>{p.avatar}</span>
                    <span className={styles.name}>{p.name}</span>
                    <span className={styles.points}>{p.points} ⭐</span>
                </div>
            ))}
        </div>
    </div>
);