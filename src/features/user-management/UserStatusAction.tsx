// src/features/user-management/UserStatusAction.tsx
import React from 'react';
import styles from './UserStatusAction.module.css';

export const UserStatusAction: React.FC<{ userId: string }> = ({ userId }) => {
    return (
        <div className={styles.actions}>
            <button className={styles.btnEdit}>Ред.</button>
            <button className={styles.btnBlock}>Блок</button>
            <button className={styles.btnFire}>Уволить</button>
        </div>
    );
};