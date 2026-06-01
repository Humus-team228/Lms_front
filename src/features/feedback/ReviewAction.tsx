// src/features/feedback/ReviewAction.tsx
import React, { useState } from 'react';
import styles from './ReviewAction.module.css';

export const ReviewAction: React.FC<{ onSubmit: (status: 'approved' | 'rejected') => void }> = ({ onSubmit }) => {
    const [comment, setComment] = useState('');

    return (
        <div className={styles.container}>
      <textarea
          placeholder="Оставьте комментарий (текст или ссылка на аудио)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={styles.textarea}
      />
            <div className={styles.buttons}>
                <button className={styles.btnReject} onClick={() => onSubmit('rejected')}>На доработку</button>
                <button className={styles.btnApprove} onClick={() => onSubmit('approved')}>Принять этап</button>
            </div>
        </div>
    );
};