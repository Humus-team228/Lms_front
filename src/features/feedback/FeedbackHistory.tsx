import React from 'react';
import styles from './FeedbackHistory.module.css';

export interface Comment {
    id: string;
    author: string;
    text: string;
    date: string;
    role: 'team_leader' | 'methodist';
}

export const FeedbackHistory: React.FC<{ comments: Comment[] }> = ({ comments }) => (
    <div className={styles.container}>
        <h4 className={styles.title}>Обратная связь</h4>
        {comments.length === 0 ? (
            <p className={styles.empty}>Комментариев пока нет</p>
        ) : (
            <div className={styles.list}>
                {comments.map(c => (
                    <div key={c.id} className={styles.comment}>
                        <div className={styles.meta}>
                            <span className={styles.author}>{c.author}</span>
                            <span className={styles.role}>{c.role === 'team_leader' ? 'Тимлид' : 'Методист'}</span>
                            <span className={styles.date}>{new Date(c.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <p className={styles.text}>{c.text}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
);